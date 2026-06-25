'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageCard } from './MessageCard'
import { MessageDetailModal } from './MessageDetailModal'
import { OrderFinalizationModal } from './OrderFinalizationModal'
import { Toast } from '@/components/ui/Toast'
import type { Collection, Message, MessageStatus } from '@/types/threadflow'

const TABS: { key: MessageStatus; label: string }[] = [
  { key: 'unresponded', label: 'Needs Response' },
  { key: 'responded', label: 'Responded' },
  { key: 'finalized', label: 'Finalized' },
]

export function InboxClient({
  initialMessages,
  collections,
  usingMockData,
}: {
  initialMessages: Message[]
  collections: Collection[]
  usingMockData: boolean
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [activeTab, setActiveTab] = useState<MessageStatus>('unresponded')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [finalizingId, setFinalizingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null)

  const showToast = useCallback((message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ message, variant })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('messages-inbox')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => {
            if (payload.eventType === 'DELETE') {
              const removedId = (payload.old as { id?: string }).id
              return prev.filter((m) => m.id !== removedId)
            }
            const incoming = payload.new as Message
            const exists = prev.some((m) => m.id === incoming.id)
            return exists
              ? prev.map((m) => (m.id === incoming.id ? incoming : m))
              : [incoming, ...prev]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  function patchMessage(patch: Partial<Message> & { id: string }) {
    setMessages((prev) => prev.map((m) => (m.id === patch.id ? { ...m, ...patch } : m)))
  }

  const visibleMessages = messages
    .filter((m) => m.status === activeTab)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const counts: Record<MessageStatus, number> = {
    unresponded: messages.filter((m) => m.status === 'unresponded').length,
    responded: messages.filter((m) => m.status === 'responded').length,
    finalized: messages.filter((m) => m.status === 'finalized').length,
  }

  const selectedMessage = messages.find((m) => m.id === selectedId) ?? null
  const finalizingMessage = messages.find((m) => m.id === finalizingId) ?? null

  return (
    <main className="px-10 py-10 pb-16">
      <header className="flex justify-between items-end mb-10">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Client Communication
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Inbox</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            All conversations from Instagram, WhatsApp, Facebook, and your website — in one place.
          </p>
        </div>
      </header>

      {usingMockData && (
        <div className="mb-8 flex items-center gap-2 border border-outline-variant bg-surface-container-low px-4 py-3">
          <span className="material-symbols-outlined text-sm text-on-surface-variant">info</span>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Showing demo data — connect the messages table in Supabase to see live conversations.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 mb-8 border-b border-outline-variant">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-label-caps font-label-caps tracking-widest border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            {tab.label}
            <span className="bg-surface-container text-on-surface-variant text-label-caps font-label-caps px-2 py-0.5 rounded-full">
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {visibleMessages.length === 0 ? (
        <div className="border border-outline-variant bg-surface-container-lowest px-6 py-12 text-center">
          <p className="text-body-sm font-body-sm text-on-surface-variant">No messages in this tab.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visibleMessages.map((message) => (
            <MessageCard key={message.id} message={message} onClick={() => setSelectedId(message.id)} />
          ))}
        </div>
      )}

      {selectedMessage && (
        <MessageDetailModal
          key={selectedMessage.id}
          message={selectedMessage}
          onClose={() => setSelectedId(null)}
          onApproved={patchMessage}
          onRequestFinalize={() => setFinalizingId(selectedMessage.id)}
          showToast={showToast}
        />
      )}

      {finalizingMessage && (
        <OrderFinalizationModal
          key={finalizingMessage.id}
          message={finalizingMessage}
          collections={collections}
          onClose={() => setFinalizingId(null)}
          onFinalized={(messageId) => {
            patchMessage({ id: messageId, status: 'finalized' })
            setFinalizingId(null)
            setSelectedId(null)
          }}
          showToast={showToast}
        />
      )}

      {toast && <Toast message={toast.message} variant={toast.variant} />}
    </main>
  )
}
