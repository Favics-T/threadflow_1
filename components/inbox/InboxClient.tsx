'use client'

import { useMemo, useState } from 'react'
import { MessageDetailModal } from './MessageDetailModal'
import { OrderFinalizationModal } from './OrderFinalizationModal'
import { Toast } from '@/components/ui/Toast'
import { formatRelativeTime } from '@/lib/format-time'
import type { Collection, Message, MessageSource, MessageStatus } from '@/types/threadflow'

type RowStatus = 'no_response' | 'pending' | 'awaiting_approval' | 'done'

interface InboxRow {
  id: string
  clientName: string
  platform: MessageSource
  message: string
  time: string
  status: RowStatus
  highPriority: boolean
}

const PLATFORM_CONFIG: Record<MessageSource, { icon: string; color: string }> = {
  instagram: { icon: 'photo_camera', color: '#E1306C' },
  whatsapp: { icon: 'chat', color: '#25D366' },
  facebook: { icon: 'thumb_up', color: '#1877F2' },
  website: { icon: 'language', color: '#4F46E5' },
}

const STATUS_CONFIG: Record<RowStatus, { label: string; className: string }> = {
  no_response: { label: 'No Response', className: 'bg-warning/10 text-warning' },
  pending: { label: 'Pending', className: 'bg-blue-100 text-blue-700' },
  awaiting_approval: { label: 'Waiting Approval', className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  done: { label: 'Done', className: 'bg-success/10 text-success' },
}

const ROW_STATUS_BY_MESSAGE_STATUS: Record<MessageStatus, RowStatus> = {
  unresponded: 'no_response',
  responded: 'pending',
  pending_approval: 'awaiting_approval',
  finalized: 'done',
}

const HIGH_PRIORITY_CLASSNAME = 'bg-urgent/10 text-urgent'

const FILTERS: { key: 'all' | RowStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'no_response', label: 'No Response' },
  { key: 'pending', label: 'Pending' },
  { key: 'awaiting_approval', label: 'Waiting Approval' },
  { key: 'done', label: 'Done' },
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

function formatDateRange(): string {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 6)
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`
}

function buildRows(messages: Message[]): InboxRow[] {
  return messages
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((m) => ({
      id: m.id,
      clientName: m.client_name,
      platform: m.source,
      message: m.content,
      time: formatRelativeTime(m.created_at),
      status: ROW_STATUS_BY_MESSAGE_STATUS[m.status],
      highPriority: m.category === 'complaint',
    }))
}

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
  const [activeFilter, setActiveFilter] = useState<'all' | RowStatus>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [finalizingId, setFinalizingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null)

  function showToast(message: string, variant: 'success' | 'error' = 'success') {
    setToast({ message, variant })
    setTimeout(() => setToast(null), 3500)
  }

  function patchMessage(patch: Partial<Message> & { id: string }) {
    setMessages((prev) => prev.map((m) => (m.id === patch.id ? { ...m, ...patch } : m)))
  }

  const allRows = useMemo(() => buildRows(messages), [messages])

  const counts: Record<'all' | RowStatus, number> = {
    all: allRows.length,
    no_response: allRows.filter((r) => r.status === 'no_response').length,
    pending: allRows.filter((r) => r.status === 'pending').length,
    awaiting_approval: allRows.filter((r) => r.status === 'awaiting_approval').length,
    done: allRows.filter((r) => r.status === 'done').length,
  }

  const query = search.trim().toLowerCase()

  const visibleRows = allRows
    .filter((r) => activeFilter === 'all' || r.status === activeFilter)
    .filter(
      (r) => !query || r.clientName.toLowerCase().includes(query) || r.message.toLowerCase().includes(query)
    )

  const selectedMessage = messages.find((m) => m.id === selectedId) ?? null
  const finalizingMessage = messages.find((m) => m.id === finalizingId) ?? null

  return (
    <main className="px-10 py-10 pb-16">
      <header className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-primary">Inbox</h1>
        <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
          Last 7 days · {formatDateRange()}
        </p>
      </header>

      {usingMockData && (
        <div className="mb-6 flex items-center gap-2 border border-outline-variant bg-surface-container-low px-4 py-3">
          <span className="material-symbols-outlined text-sm text-on-surface-variant">info</span>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Showing demo data — connect the messages table in Supabase to see live conversations.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key

            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-label-caps font-label-caps tracking-widest transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'border border-outline-variant text-on-surface-variant hover:text-primary'
                }`}
              >
                {filter.label}
                {filter.key !== 'all' && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-label-caps font-label-caps ${
                      isActive ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {counts[filter.key]}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            style={{ fontSize: '18px' }}
          >
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

      <div className="border border-outline-variant bg-surface-container-lowest overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-container">
              <th className="w-12 px-4 py-3">
                <input type="checkbox" className="h-4 w-4" aria-label="Select all" />
              </th>
              <th className="px-4 py-3 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                Platform
              </th>
              <th className="px-4 py-3 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                Client
              </th>
              <th className="px-4 py-3 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                Message
              </th>
              <th className="px-4 py-3 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                Time
              </th>
              <th className="px-4 py-3 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-body-sm font-body-sm text-on-surface-variant">
                  No messages match this filter.
                </td>
              </tr>
            ) : (
              visibleRows.map((row, i) => {
                const platform = PLATFORM_CONFIG[row.platform]
                const status = STATUS_CONFIG[row.status]

                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className={`cursor-pointer transition-colors hover:bg-surface-container/50 ${
                      i < visibleRows.length - 1 ? 'border-b border-outline-variant' : ''
                    }`}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="h-4 w-4" aria-label={`Select ${row.clientName}`} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="material-symbols-outlined" style={{ color: platform.color, fontSize: '18px' }}>
                        {platform.icon}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-label-caps font-label-caps text-primary">
                          {getInitials(row.clientName)}
                        </span>
                        <span className="text-body-sm font-body-sm text-on-surface whitespace-nowrap">
                          {row.clientName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-body-sm font-body-sm text-on-surface-variant truncate">{row.message}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-label-caps font-label-caps text-on-surface-variant whitespace-nowrap">
                        {row.time}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-label-caps font-label-caps whitespace-nowrap ${
                          row.highPriority ? HIGH_PRIORITY_CLASSNAME : status.className
                        }`}
                      >
                        {row.highPriority ? 'High Priority' : status.label}
                      </span>
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
