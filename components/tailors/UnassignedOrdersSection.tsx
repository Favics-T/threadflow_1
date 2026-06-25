'use client'

import { useState, useTransition } from 'react'
import { DeadlineBadge } from '@/components/ui/DeadlineBadge'
import { createManualAssignment, type CreatedAssignment } from '@/app/tailors/actions'
import type { Tailor } from '@/types/threadflow'
import type { BoardOrder } from '@/lib/supabase/orders'

export function UnassignedOrdersSection({
  orders,
  tailors,
  onAssigned,
  showToast,
}: {
  orders: BoardOrder[]
  tailors: Tailor[]
  onAssigned: (assignment: CreatedAssignment) => void
  showToast: (message: string, variant?: 'success' | 'error') => void
}) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
          Unassigned Orders
        </h2>
        <span className="bg-surface-container text-on-surface-variant text-label-caps font-label-caps px-2 py-0.5 rounded-full">
          {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="border border-outline-variant bg-surface-container-lowest px-6 py-8 text-center">
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            No unassigned orders — every confirmed order has a tailor.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <ManualAssignRow
              key={order.id}
              order={order}
              tailors={tailors}
              onAssigned={onAssigned}
              showToast={showToast}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function ManualAssignRow({
  order,
  tailors,
  onAssigned,
  showToast,
}: {
  order: BoardOrder
  tailors: Tailor[]
  onAssigned: (assignment: CreatedAssignment) => void
  showToast: (message: string, variant?: 'success' | 'error') => void
}) {
  const [tailorId, setTailorId] = useState(tailors[0]?.id ?? '')
  const [roleDescription, setRoleDescription] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    if (!tailorId) {
      showToast('Pick a tailor first.', 'error')
      return
    }
    if (!roleDescription.trim()) {
      showToast('Add a role description first.', 'error')
      return
    }

    startTransition(async () => {
      const result = await createManualAssignment({ orderId: order.id, tailorId, roleDescription })
      if (result.error || !result.data) {
        showToast(result.error ?? 'Something went wrong.', 'error')
        return
      }
      onAssigned(result.data)
      showToast(`${order.client_name}'s order assigned.`)
    })
  }

  return (
    <div className="border border-outline-variant bg-surface-container-lowest px-6 py-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-body-sm font-body-sm font-semibold text-primary">{order.client_name}</p>
          <p className="text-body-sm font-body-sm text-on-surface-variant">{order.cloth_type}</p>
        </div>
        <DeadlineBadge deadline={order.deadline} />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={tailorId}
          onChange={(e) => setTailorId(e.target.value)}
          className="flex-1 min-w-[180px] border border-outline-variant bg-surface-container-lowest text-on-surface text-body-sm font-body-sm px-3 py-2 focus:outline-none focus:border-primary"
        >
          {tailors.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — {t.current_load} order{t.current_load === 1 ? '' : 's'}
              {t.is_available ? '' : ' (unavailable)'}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={roleDescription}
          onChange={(e) => setRoleDescription(e.target.value)}
          placeholder="Role description, e.g. Lead seamstress"
          className="flex-1 min-w-[200px] border border-outline-variant bg-surface-container-lowest text-on-surface text-body-sm font-body-sm px-3 py-2 focus:outline-none focus:border-primary placeholder:text-outline-variant"
        />
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-5 py-2 bg-primary text-on-primary text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
        >
          {isPending ? 'SAVING…' : 'SAVE'}
        </button>
      </div>
    </div>
  )
}
