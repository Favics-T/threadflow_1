'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageDetailModal } from './MessageDetailModal'
import { OrderFinalizationModal } from './OrderFinalizationModal'
import { PlatformConnections } from './PlatformConnections'
import { StatusPill } from './StatusPill'
import { Toast } from '@/components/ui/Toast'
import { formatRelativeTime } from '@/lib/format-time'
import type { Collection, Message, MessageStatus } from '@/types/threadflow'

const FILTERS: { key: MessageStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unresponded', label: 'Needs Response' },
  { key: 'responded', label: 'Responded' },
  { key: 'finalized', label: 'Finalized' },
]

const SOURCE_ICON: Record<Message['source'], { icon: string; className: string }> = {
  instagram: { icon: 'photo_camera', className: 'text-pink-600' },
  whatsapp: { icon: 'chat', className: 'text-green-600' },
  facebook: { icon: 'thumb_up', className: 'text-blue-600' },
  website: { icon: 'language', className: 'text-on-surface-variant' },
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

export function InboxClient({
  initialMessages,
  collections,
}: {
  initialMessages: Message[]
  collections: Collection[]
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [activeFilter, setActiveFilter] = useState<MessageStatus | 'all'>('all')
  const [search, setSearch] = useState('')
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

  const query = search.trim().toLowerCase()

  const visibleMessages = messages
    .filter((m) => activeFilter === 'all' || m.status === activeFilter)
    .filter((m) => {
      if (!query) return true
      return (
        m.client_name.toLowerCase().includes(query) ||
        m.client_contact.toLowerCase().includes(query) ||
        m.content.toLowerCase().includes(query) ||
        (m.cloth_type ?? '').toLowerCase().includes(query)
      )
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const counts: Record<MessageStatus | 'all', number> = {
    all: messages.length,
    unresponded: messages.filter((m) => m.status === 'unresponded').length,
    responded: messages.filter((m) => m.status === 'responded').length,
    finalized: messages.filter((m) => m.status === 'finalized').length,
  }

  const selectedMessage = messages.find((m) => m.id === selectedId) ?? null
  const finalizingMessage = messages.find((m) => m.id === finalizingId) ?? null

  return (
    <main className="px-10 py-10 pb-16">
      <header className="flex justify-between items-end mb-8">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Client Communication
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Inbox</h1>
          <p className="text-body-sm font-body-sm text-on-surface-variant mt-2">
            {messages.length} conversations · Instagram, WhatsApp, Facebook & Website
          </p>
        </div>
      </header>

      <PlatformConnections />

      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-label-caps font-label-caps tracking-widest transition-colors ${
                activeFilter === filter.key
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {filter.label}
              <span
                className={`rounded-full px-2 py-0.5 text-label-caps font-label-caps ${
                  activeFilter === filter.key
                    ? 'bg-on-primary/20 text-on-primary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {counts[filter.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '18px' }}>
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-64 rounded-full border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-4 text-body-sm font-body-sm text-on-surface placeholder:text-on-surface-variant outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <div className="border border-outline-variant bg-surface-container-lowest">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="w-12 px-4 py-3" />
              <th className="px-4 py-3 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">Order</th>
              <th className="px-4 py-3 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">Items</th>
              <th className="px-4 py-3 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">Total</th>
              <th className="px-4 py-3 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">Time</th>
              <th className="px-4 py-3 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleMessages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-body-sm font-body-sm text-on-surface-variant">
                  No conversations match this filter.
                </td>
              </tr>
            ) : (
              visibleMessages.map((message) => {
                const isConfirmed = message.status === 'finalized'
                const sourceIcon = SOURCE_ICON[message.source]

                return (
                  <tr
                    key={message.id}
                    onClick={() => setSelectedId(message.id)}
                    className="cursor-pointer border-b border-outline-variant last:border-b-0 transition-colors hover:bg-surface-container-low"
                  >
                    <td className="px-4 py-4">
                      <span
                        className={`flex h-5 w-5 items-center justify-center border ${
                          isConfirmed ? 'border-primary bg-primary' : 'border-outline-variant bg-transparent'
                        }`}
                      >
                        {isConfirmed && (
                          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '14px' }}>
                            check
                          </span>
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>
                          checkroom
                        </span>
                        <span className="text-body-sm font-body-sm font-semibold text-primary whitespace-nowrap">
                          {message.cloth_type ?? 'Custom Order'}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 max-w-sm">
                      <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2">
                        {message.content}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-label-caps font-label-caps text-on-surface-variant">
                          {getInitials(message.client_name)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-body-sm font-body-sm font-semibold text-primary truncate">
                            {message.client_name}
                          </p>
                          <p className="flex items-center gap-1 text-label-caps font-label-caps text-on-surface-variant truncate">
                            <span className={`material-symbols-outlined ${sourceIcon.className}`} style={{ fontSize: '12px' }}>
                              {sourceIcon.icon}
                            </span>
                            {message.client_contact}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-body-sm font-body-sm text-on-surface-variant whitespace-nowrap">
                        {formatRelativeTime(message.created_at)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <StatusPill message={message} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

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
