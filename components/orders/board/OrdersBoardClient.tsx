'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { OrderCard } from './OrderCard'
import { OrderDetailDrawer } from './OrderDetailDrawer'
import { Toast } from '@/components/ui/Toast'
import { confirmOrder } from '@/app/orders/actions'
import type { OrderStatus } from '@/types/threadflow'
import type { BoardOrder } from '@/lib/supabase/orders'

const COLUMNS: { key: OrderStatus; label: string; description: string }[] = [
  { key: 'confirmed', label: 'Confirmed', description: 'Awaiting tailor confirmation or assignment.' },
  { key: 'in_production', label: 'In Production', description: 'Assigned to a tailor and underway.' },
  { key: 'ready', label: 'Ready', description: 'Completed, 3+ days ahead of deadline.' },
  { key: 'delivered', label: 'Delivered', description: 'Handed off to the client.' },
]

const EMPTY_COPY: Record<OrderStatus, string> = {
  confirmed: 'No confirmed orders yet — finalize a client message to create one.',
  in_production: 'No orders in production yet — assign a tailor to get started.',
  ready: 'No orders ready yet — completed orders with buffer before deadline will land here.',
  delivered: 'No orders delivered yet.',
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

  const selectedOrder = orders.find((o) => o.id === selectedId) ?? null

  return (
    <main className="px-10 py-10 pb-16">
      <header className="flex justify-between items-end mb-10">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {COLUMNS.map((column) => {
          const columnOrders = orders.filter((o) => o.status === column.key)

          return (
            <div key={column.key} className="flex flex-col gap-3 min-w-0">
              <div className="flex flex-col gap-1 mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                    {column.label}
                  </h2>
                  <span className="bg-surface-container text-on-surface-variant text-label-caps font-label-caps px-2 py-0.5 rounded-full">
                    {columnOrders.length}
                  </span>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">{column.description}</p>
              </div>

              {columnOrders.length === 0 ? (
                <div className="border border-outline-variant bg-surface-container-lowest px-4 py-8 text-center">
                  <p className="text-body-sm font-body-sm text-on-surface-variant">{EMPTY_COPY[column.key]}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {columnOrders.map((order) => (
                    <OrderCard key={order.id} order={order} onClick={() => setSelectedId(order.id)} />
                  ))}
                </div>
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
