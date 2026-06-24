'use client'

import { useState } from 'react'
import Link from 'next/link'

type OrderSource = 'instagram' | 'website' | 'whatsapp'
type OrderUrgency = 'high' | 'normal'

type IncomingOrder = {
  id: string
  source: OrderSource
  clientName: string
  message: string
  time: string
  read: boolean
  urgency: OrderUrgency
  details: string
}

type DraftResult = {
  draft_message: string
  delivery_estimate: string
  estimate_status: string
  reasoning: string[]
}

const mockIncoming: IncomingOrder[] = [
  {
    id: '1',
    source: 'instagram',
    clientName: 'Kemi Adeleke',
    message: 'Hi! I saw your post about the ankara collections. I need a custom gown for my wedding in December, can we discuss?',
    time: '8 min ago',
    read: false,
    urgency: 'high',
    details: 'Custom wedding gown · December deadline',
  },
  {
    id: '2',
    source: 'website',
    clientName: 'Ngozi Obi',
    message: 'Order submitted via website booking form. Requests a fitted blazer suit for corporate event.',
    time: '23 min ago',
    read: false,
    urgency: 'normal',
    details: 'Corporate blazer suit · No deadline set',
  },
  {
    id: '3',
    source: 'instagram',
    clientName: 'Adaeze',
    message: 'Good morning! I placed an order last week, just checking in — when will my dress be ready?',
    time: '1 hr ago',
    read: true,
    urgency: 'normal',
    details: 'Status enquiry — existing order',
  },
]

const sourceConfig: Record<OrderSource, { label: string; icon: string; color: string; bg: string }> = {
  instagram: { label: 'Instagram', icon: 'photo_camera', color: '#E1306C', bg: '#E1306C15' },
  website:   { label: 'Website',   icon: 'language',     color: '#4F46E5', bg: '#4F46E515' },
  whatsapp:  { label: 'WhatsApp',  icon: 'chat',         color: '#25D366', bg: '#25D36615' },
}

export function IncomingOrders() {
  const [orders, setOrders] = useState(mockIncoming)
  const [drafting, setDrafting] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, DraftResult | { error: string }>>({})
  const [approved, setApproved] = useState<string[]>([])
  const [discarded, setDiscarded] = useState<string[]>([])

  const unreadCount = orders.filter((o) => !o.read).length

  function markRead(id: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, read: true } : o)))
  }

  async function handleAiReply(order: IncomingOrder) {
    markRead(order.id)
    setDrafting(order.id)
    try {
      const res = await fetch('/api/agent/draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName: order.clientName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Agent error')
      setDrafts((prev) => ({ ...prev, [order.id]: data }))
    } catch (err) {
      setDrafts((prev) => ({
        ...prev,
        [order.id]: { error: err instanceof Error ? err.message : 'Something went wrong' },
      }))
    } finally {
      setDrafting(null)
    }
  }

  return (
    <section>
      <div className="flex flex-col gap-3 mb-6">
        <div>
          <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-1">
            Incoming Messages
          </h2>
          {unreadCount > 0 ? (
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              <span className="text-primary font-semibold">{unreadCount} unread</span>
              {' '}— clients are waiting for a response
            </p>
          ) : (
            <p className="text-body-sm font-body-sm text-on-surface-variant">All messages read</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const src = sourceConfig[order.source]
          const isDrafting = drafting === order.id
          const draft = drafts[order.id]
          const isApproved = approved.includes(order.id)
          const isDiscarded = discarded.includes(order.id)

          return (
            <div
              key={order.id}
              className={`border bg-surface-container-lowest transition-all ${
                !order.read ? 'border-primary bg-primary-fixed/30' : 'border-outline-variant'
              }`}
            >
              <div className="flex items-start gap-4 px-6 py-5">
                {/* Unread dot */}
                <div className="shrink-0 mt-1.5">
                  {!order.read ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-surface-container block" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {/* Platform badge */}
                    <div
                      className="flex items-center gap-1.5 px-2 py-0.5"
                      style={{ backgroundColor: src.bg }}
                    >
                      <span
                        className="material-symbols-outlined text-xs"
                        style={{ color: src.color, fontSize: '14px' }}
                      >
                        {src.icon}
                      </span>
                      <span
                        className="text-label-caps font-label-caps"
                        style={{ color: src.color }}
                      >
                        {src.label}
                      </span>
                    </div>

                    <p className="text-body-sm font-body-sm font-semibold text-primary">
                      {order.clientName}
                    </p>

                    {order.urgency === 'high' && (
                      <span className="text-label-caps font-label-caps px-2 py-0.5 bg-error-container text-on-error-container">
                        HIGH PRIORITY
                      </span>
                    )}

                    <span className="text-label-caps font-label-caps text-on-surface-variant ml-auto">
                      {order.time}
                    </span>
                  </div>

                  <p className="text-body-sm font-body-sm text-on-surface leading-relaxed mb-2">
                    &ldquo;{order.message}&rdquo;
                  </p>

                  <p className="text-label-caps font-label-caps text-on-surface-variant">
                    {order.details}
                  </p>
                </div>
              </div>

              {/* AI Draft result inline */}
              {draft && !('error' in draft) && !isApproved && !isDiscarded && (
                <div className="mx-6 mb-4 border border-outline-variant bg-surface-container-low">
                  <div className="px-4 py-3 border-b border-outline-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-tertiary">magic_button</span>
                    <span className="text-label-caps font-label-caps text-on-surface-variant">AI drafted reply</span>
                    <span className={`ml-auto text-label-caps font-label-caps px-2 py-0.5 ${
                      draft.estimate_status === 'on_track'
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                        : draft.estimate_status === 'at_risk'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-error-container text-on-error-container'
                    }`}>
                      {draft.estimate_status === 'on_track' ? 'ON TRACK' : draft.estimate_status === 'at_risk' ? 'AT RISK' : 'BLOCKED'}
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-body-sm font-body-sm text-on-surface leading-relaxed italic mb-3">
                      &ldquo;{draft.draft_message}&rdquo;
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setApproved((p) => [...p, order.id])}
                        className="flex-1 py-2 bg-primary text-on-primary text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
                      >
                        APPROVE &amp; SEND
                      </button>
                      <button
                        onClick={() => setDiscarded((p) => [...p, order.id])}
                        className="flex-1 py-2 border border-outline-variant text-on-surface-variant text-label-caps font-label-caps hover:bg-surface-container transition-colors"
                      >
                        DISCARD
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Draft error */}
              {draft && 'error' in draft && (
                <div className="mx-6 mb-4 flex items-start gap-2 bg-error-container/30 p-3">
                  <span className="material-symbols-outlined text-sm text-on-error-container mt-0.5">error</span>
                  <p className="text-body-sm font-body-sm text-on-error-container">{draft.error}</p>
                </div>
              )}

              {/* Approved / discarded states */}
              {isApproved && (
                <div className="mx-6 mb-4 flex items-center gap-2 bg-tertiary-fixed/40 px-4 py-3">
                  <span className="material-symbols-outlined text-sm text-tertiary">check_circle</span>
                  <span className="text-label-caps font-label-caps text-on-surface-variant">Reply sent to {order.clientName}</span>
                </div>
              )}
              {isDiscarded && (
                <div className="mx-6 mb-4 px-4 py-3 bg-surface-container">
                  <span className="text-label-caps font-label-caps text-on-surface-variant">Reply discarded. No message sent.</span>
                </div>
              )}

              {/* Action row */}
              <div className="flex items-center gap-3 px-6 py-3 border-t border-outline-variant bg-surface-container-low/40">
                {!draft && !isApproved && !isDiscarded ? (
                  <>
                    <button
                      onClick={() => handleAiReply(order)}
                      disabled={isDrafting}
                      className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">magic_button</span>
                      {isDrafting ? 'DRAFTING...' : 'AI REPLY'}
                    </button>
                    <Link
                      href={`/agent?prompt=${encodeURIComponent(`Who should I assign the new order from ${order.clientName} to?`)}`}
                      className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant px-4 py-2 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">person_add</span>
                      ASSIGN TAILOR
                    </Link>
                    {!order.read && (
                      <button
                        onClick={() => markRead(order.id)}
                        className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors ml-auto"
                      >
                        Mark as read
                      </button>
                    )}
                  </>
                ) : isDrafting ? (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant animate-spin">progress_activity</span>
                    <span className="text-label-caps font-label-caps text-on-surface-variant">Agent is checking order data…</span>
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}