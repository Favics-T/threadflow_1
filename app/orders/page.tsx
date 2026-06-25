'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mockProductionOrders } from '@/lib/mock/conversations'
import type { ProductionOrder, ProductionStatus } from '@/lib/types/conversations'
import { PlatformConnections } from '@/components/orders/PlatformConnections'

// ── Status display config ─────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ProductionStatus, { label: string; className: string }> = {
  pending_confirmation: { label: 'AWAITING CONFIRMATION', className: 'bg-surface-container text-on-surface-variant' },
  confirmed:            { label: 'CONFIRMED',              className: 'bg-primary-fixed text-on-primary-fixed-variant' },
  assigned:             { label: 'TAILOR ASSIGNED',        className: 'bg-primary-fixed text-on-primary-fixed-variant' },
  in_production:        { label: 'IN PRODUCTION',          className: 'bg-primary-fixed text-on-primary-fixed-variant' },
  quality_control:      { label: 'QUALITY CONTROL',        className: 'bg-amber-50 text-amber-800' },
  ready_for_delivery:   { label: 'READY FOR DELIVERY',     className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  delivered:            { label: 'DELIVERED',              className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
}

const PLATFORM_CONFIG = {
  instagram: { label: 'Instagram', icon: 'photo_camera', color: '#E1306C', bg: '#E1306C15' },
  whatsapp:  { label: 'WhatsApp',  icon: 'chat',         color: '#25D366', bg: '#25D36615' },
  website:   { label: 'Website',   icon: 'language',     color: '#4F46E5', bg: '#4F46E515' },
  facebook:  { label: 'Facebook',  icon: 'thumb_up',     color: '#1877F2', bg: '#1877F215' },
} as const

// ── This week's orders (mock: all non-delivered) ──────────────────────────────
function isThisWeek(order: ProductionOrder) {
  return order.productionStatus !== 'delivered'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<ProductionOrder[]>(mockProductionOrders)
  const [confirming, setConfirming] = useState<string[]>([])
  const [rejecting, setRejecting] = useState<string[]>([])

  const thisWeek = orders.filter(isThisWeek)
  const delivered = orders.filter((o) => o.productionStatus === 'delivered')

  function handleConfirm(id: string) {
    setConfirming((p) => [...p, id])
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, productionStatus: 'confirmed' as ProductionStatus } : o
        )
      )
      setConfirming((p) => p.filter((x) => x !== id))
    }, 700)
  }

  function handleReject(id: string) {
    setRejecting((p) => [...p, id])
    setTimeout(() => {
      // Remove from orders — it goes back to Pending in Inbox
      setOrders((prev) => prev.filter((o) => o.id !== id))
      setRejecting((p) => p.filter((x) => x !== id))
    }, 700)
  }

  return (
    <main className="px-10 py-10 pb-16">
      {/* Header */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Production
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Orders</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            Confirmed orders from your client inbox. Confirm each order to unlock tailor assignment.
          </p>
        </div>
        <Link
          href="/orders/history"
          className="flex items-center gap-2 border border-outline-variant text-on-surface-variant px-6 py-2.5 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">history</span>
          ORDER HISTORY
        </Link>
      </header>

      {/* Platform connections */}
      <PlatformConnections />

      {/* This week */}
      <section className="mb-12">
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
              This Week
            </h2>
            <span className="bg-surface-container text-on-surface-variant text-label-caps font-label-caps px-2 py-0.5 rounded-full">
              {thisWeek.length}
            </span>
          </div>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Active production orders. Confirm to assign to your workforce.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {thisWeek.map((order) => {
            const status = STATUS_CONFIG[order.productionStatus]
            const platform = PLATFORM_CONFIG[order.platform]
            const isConfirming = confirming.includes(order.id)
            const isRejecting = rejecting.includes(order.id)
            const needsConfirmation = order.productionStatus === 'pending_confirmation'

            return (
              <div
                key={order.id}
                className={`border bg-surface-container-lowest transition-all ${
                  needsConfirmation ? 'border-primary' : 'border-outline-variant'
                } ${isConfirming || isRejecting ? 'opacity-60' : ''}`}
              >
                {/* Main card body */}
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      {/* Platform source dot */}
                      <div
                        className="flex items-center gap-1.5 px-2 py-0.5 shrink-0"
                        style={{ backgroundColor: platform.bg }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ color: platform.color, fontSize: '13px' }}
                        >
                          {platform.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-body-sm font-body-sm font-semibold text-primary mb-0.5">
                          {order.clientName}
                        </p>
                        <p className="text-body-sm font-body-sm text-on-surface leading-relaxed">
                          {order.garmentDescription}
                        </p>
                      </div>
                    </div>
                    <span className={`shrink-0 text-label-caps font-label-caps px-2 py-0.5 whitespace-nowrap ${status.className}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Metadata row */}
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-on-surface-variant"
                        style={{ fontSize: '14px' }}
                      >
                        calendar_today
                      </span>
                      <span className="text-label-caps font-label-caps text-on-surface-variant">
                        Due {order.agreedDeliveryDate}
                      </span>
                    </div>
                    {order.tailorName && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="material-symbols-outlined text-on-surface-variant"
                          style={{ fontSize: '14px' }}
                        >
                          person
                        </span>
                        <span className="text-label-caps font-label-caps text-on-surface-variant">
                          {order.tailorName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action row */}
                <div className="flex items-center gap-3 px-6 py-3 border-t border-outline-variant bg-surface-container-low/40">
                  {isConfirming ? (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant animate-spin">
                        progress_activity
                      </span>
                      <span className="text-label-caps font-label-caps text-on-surface-variant">
                        Confirming order…
                      </span>
                    </div>
                  ) : isRejecting ? (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant animate-spin">
                        progress_activity
                      </span>
                      <span className="text-label-caps font-label-caps text-on-surface-variant">
                        Sending back to Inbox…
                      </span>
                    </div>
                  ) : needsConfirmation ? (
                    <>
                      <button
                        onClick={() => handleConfirm(order.id)}
                        className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-sm">task_alt</span>
                        CONFIRM ORDER
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant px-4 py-2 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">undo</span>
                        RETURN TO INBOX
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/workforce?order=${order.id}`}
                        className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        ASSIGN TAILOR
                      </Link>
                      <Link
                        href={`/inbox`}
                        className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant px-4 py-2 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">forum</span>
                        VIEW CONVERSATION
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Delivered this period */}
      {delivered.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
              Recently Delivered
            </h2>
            <span className="bg-surface-container text-on-surface-variant text-label-caps font-label-caps px-2 py-0.5 rounded-full">
              {delivered.length}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {delivered.map((order) => {
              const platform = PLATFORM_CONFIG[order.platform]
              return (
                <div
                  key={order.id}
                  className="border border-outline-variant bg-surface-container-lowest px-6 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5"
                      style={{ backgroundColor: platform.bg }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ color: platform.color, fontSize: '13px' }}
                      >
                        {platform.icon}
                      </span>
                    </div>
                    <p className="text-body-sm font-body-sm font-semibold text-primary">
                      {order.clientName}
                    </p>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">
                      {order.garmentDescription}
                    </p>
                  </div>
                  <span className="text-label-caps font-label-caps px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant shrink-0">
                    DELIVERED
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}