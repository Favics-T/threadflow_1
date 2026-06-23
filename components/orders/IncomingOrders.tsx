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
    clientName: 'Funmi Balogun',
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
  const [responding, setResponding] = useState<string | null>(null)
  const [responded, setResponded] = useState<string[]>([])

  const unreadCount = orders.filter((o) => !o.read).length

  function markRead(id: string) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, read: true } : o))
  }

  function handleRespond(id: string) {
    setResponding(id)
    markRead(id)
    setTimeout(() => {
      setResponding(null)
      setResponded((prev) => [...prev, id])
    }, 1200)
  }

  function handleAssign(id: string) {
    markRead(id)
    window.location.href = '/agent?action=assign&order=' + id
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
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
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              All messages read
            </p>
          )}
        </div>
        <Link
          href="/orders/history"
          className="flex items-center gap-1 text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors"
        >
          VIEW ORDER HISTORY
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const src = sourceConfig[order.source]
          const isResponding = responding === order.id
          const hasResponded = responded.includes(order.id)

          return (
            <div
              key={order.id}
              className={`border bg-surface-container-lowest transition-all ${
                !order.read
                  ? 'border-primary bg-primary-fixed/30'
                  : 'border-outline-variant'
              }`}
            >
              <div className="flex items-start gap-4 px-6 py-5">

                {/* Unread dot */}
                <div className="flex-shrink-0 mt-1.5">
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
                    "{order.message}"
                  </p>

                  <p className="text-label-caps font-label-caps text-on-surface-variant">
                    {order.details}
                  </p>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-3 px-6 py-3 border-t border-outline-variant bg-surface-container-low/40">
                {hasResponded ? (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-tertiary">check_circle</span>
                    <span className="text-label-caps font-label-caps text-on-surface-variant">
                      Response sent via AI Agent
                    </span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleRespond(order.id)}
                      disabled={isResponding}
                      className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">magic_button</span>
                      {isResponding ? 'DRAFTING...' : 'AI REPLY'}
                    </button>
                    <button
                      onClick={() => handleAssign(order.id)}
                      className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant px-4 py-2 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">person_add</span>
                      ASSIGN TAILOR
                    </button>
                    {!order.read && (
                      <button
                        onClick={() => markRead(order.id)}
                        className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors ml-auto"
                      >
                        Mark as read
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}