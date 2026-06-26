'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { OrderDetailDrawer } from './OrderDetailDrawer'
import { Toast } from '@/components/ui/Toast'
import { confirmOrder } from '@/app/orders/actions'
import type { MessageSource, OrderStatus } from '@/types/threadflow'
import type { BoardOrder } from '@/lib/supabase/orders'

const GROUPS: { key: OrderStatus; label: string; dotColor: string }[] = [
  { key: 'confirmed', label: 'Confirmed', dotColor: '#10B981' },
  { key: 'in_production', label: 'In Production', dotColor: '#3B82F6' },
  { key: 'ready', label: 'Ready for Delivery', dotColor: '#F59E0B' },
  { key: 'delivered', label: 'Delivered', dotColor: '#6B7280' },
]

const EMPTY_COPY: Record<OrderStatus, string> = {
  confirmed: 'No confirmed orders yet — finalize a client message to create one.',
  in_production: 'No orders in production yet — assign a tailor to get started.',
  ready: 'No orders ready yet — completed orders with buffer before deadline will land here.',
  delivered: 'No orders delivered yet.',
}

const STATUS_PILL_LABEL: Record<OrderStatus, string> = {
  confirmed: 'Confirmed',
  in_production: 'In Production',
  ready: 'Ready',
  delivered: 'Delivered',
}

const STATUS_PILL_STYLES: Record<OrderStatus, string> = {
  confirmed: 'bg-success/10 text-success',
  in_production: 'bg-primary-fixed text-on-primary-fixed-variant',
  ready: 'bg-warning/10 text-warning',
  delivered: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
}

const PLATFORM_BADGE: Record<MessageSource, { label: string; className: string }> = {
  instagram: { label: 'IG', className: 'bg-pink-100 text-pink-700' },
  whatsapp: { label: 'WA', className: 'bg-green-100 text-green-700' },
  facebook: { label: 'FB', className: 'bg-blue-100 text-blue-700' },
  website: { label: 'Web', className: 'bg-gray-100 text-gray-700' },
}

const TABS = ['List view', 'Board view', 'Calendar view'] as const

function formatDueDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function OrdersBoardClient({
  initialOrders,
  usingMockData,
}: {
  initialOrders: BoardOrder[]
  usingMockData: boolean
}) {
  const router = useRouter()
  const [orders, setOrders] = useState<BoardOrder[]>(initialOrders)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null)
  const [, startTransition] = useTransition()
  const [collapsed, setCollapsed] = useState<Record<OrderStatus, boolean>>({
    confirmed: false,
    in_production: false,
    ready: false,
    delivered: false,
  })

  function showToast(message: string, variant: 'success' | 'error' = 'success') {
    setToast({ message, variant })
    setTimeout(() => setToast(null), 3500)
  }

  function handleConfirm(orderId: string, clientName: string) {
    setConfirmingId(orderId)
    startTransition(async () => {
      const result = await confirmOrder(orderId)
      setConfirmingId(null)
      if (result.error) {
        showToast(result.error, 'error')
        return
      }
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, tailor_confirmed: true } : o)))
      showToast(`${clientName}'s order confirmed — ready for tailor assignment.`)
    })
  }

  function toggleGroup(key: OrderStatus) {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const selectedOrder = orders.find((o) => o.id === selectedId) ?? null

  return (
    <main className="px-10 py-10 pb-16">
      <header className="flex justify-between items-end mb-8">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Production
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Orders Board</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            Every confirmed order, from fabric to delivery.
          </p>
        </div>
      </header>

      {usingMockData && (
        <div className="mb-8 flex items-center gap-2 border border-outline-variant bg-surface-container-low px-4 py-3">
          <span className="material-symbols-outlined text-sm text-on-surface-variant">info</span>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Showing demo data — connect the orders table in Supabase to see live orders.
          </p>
        </div>
      )}

      <div className="flex items-end justify-between gap-4 border-b border-outline-variant mb-6">
        <div className="flex items-center gap-6">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`pb-3 text-body-sm font-body-sm transition-colors ${
                i === 0
                  ? 'text-primary font-semibold border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 bg-primary text-on-primary rounded-full px-4 py-2 mb-3 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity shrink-0">
          <span className="material-symbols-outlined text-sm">add</span>
          New Order
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {GROUPS.map((group) => {
          const groupOrders = orders.filter((o) => o.status === group.key)
          const isCollapsed = collapsed[group.key]

          return (
            <div key={group.key} className="border border-outline-variant bg-surface-container-lowest">
              <div className="flex items-center justify-between gap-3 px-4 py-3 bg-surface-container-low">
                <button
                  onClick={() => toggleGroup(group.key)}
                  className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isCollapsed ? 'expand_more' : 'expand_less'}
                  </span>
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: group.dotColor }} />
                  <span className="text-body-sm font-body-sm font-semibold text-on-surface">{group.label}</span>
                  <span className="bg-surface-container text-on-surface-variant text-label-caps font-label-caps px-2 py-0.5 rounded-full">
                    {groupOrders.length}
                  </span>
                </button>
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">more_horiz</span>
                </button>
              </div>

              {isCollapsed ? (
                <div className="flex items-center justify-between px-4 py-3">
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    {groupOrders.length} order{groupOrders.length === 1 ? '' : 's'} hidden in this view
                  </p>
                  <button
                    onClick={() => toggleGroup(group.key)}
                    className="text-label-caps font-label-caps text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>
              ) : (
                <>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-surface-container">
                        <th className="w-10 px-4 py-2">
                          <input type="checkbox" className="h-4 w-4" aria-label="Select all" />
                        </th>
                        <th className="px-4 py-2 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                          Order
                        </th>
                        <th className="px-4 py-2 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                          Garment
                        </th>
                        <th className="px-4 py-2 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                          Tailor
                        </th>
                        <th className="px-4 py-2 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                          Due Date
                        </th>
                        <th className="px-4 py-2 text-left text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-body-sm font-body-sm text-on-surface-variant">
                            {EMPTY_COPY[group.key]}
                          </td>
                        </tr>
                      ) : (
                        groupOrders.map((order) => {
                          const platform = order.message ? PLATFORM_BADGE[order.message.source] : null

                          return (
                            <tr
                              key={order.id}
                              onClick={() => setSelectedId(order.id)}
                              className="cursor-pointer border-b border-outline-variant hover:bg-surface-container/40 transition-colors"
                            >
                              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" className="h-4 w-4" aria-label={`Select ${order.client_name}`} />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-body-sm font-body-sm font-semibold text-primary whitespace-nowrap">
                                    {order.client_name}
                                  </span>
                                  {platform && (
                                    <span
                                      className={`text-label-caps font-label-caps px-2 py-0.5 rounded-full whitespace-nowrap ${platform.className}`}
                                    >
                                      {platform.label}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 max-w-xs">
                                <p className="text-body-sm font-body-sm text-on-surface-variant truncate">
                                  {order.description || order.cloth_type}
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-body-sm font-body-sm text-on-surface-variant whitespace-nowrap">
                                  {order.assignment?.tailorName ?? '— Unassigned'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-body-sm font-body-sm text-on-surface-variant whitespace-nowrap">
                                  {formatDueDate(order.deadline)}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-full px-3 py-1 text-label-caps font-label-caps whitespace-nowrap ${STATUS_PILL_STYLES[order.status]}`}
                                >
                                  {STATUS_PILL_LABEL[order.status]}
                                </span>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                  <button className="w-full text-left px-4 py-3 text-body-sm font-body-sm text-on-surface-variant hover:bg-surface-container/40 transition-colors flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add New
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>

      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedId(null)}
          onAssignRequested={() => router.push('/tailors')}
          onConfirmRequested={() => handleConfirm(selectedOrder.id, selectedOrder.client_name)}
          isConfirming={confirmingId === selectedOrder.id}
        />
      )}

      {toast && <Toast message={toast.message} variant={toast.variant} />}
    </main>
  )
}
