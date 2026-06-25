'use client'

import { useTransition } from 'react'
import { AssignmentRow } from './AssignmentRow'
import { toggleTailorAvailability } from '@/app/tailors/actions'
import type { Tailor } from '@/types/threadflow'
import type { BoardOrder } from '@/lib/supabase/orders'

const DISPLAY_CAPACITY = 4

export function TailorCard({
  tailor,
  assignedOrders,
  onAvailabilityChange,
  onAssignmentApproved,
  onRoleUpdated,
  showToast,
}: {
  tailor: Tailor
  assignedOrders: BoardOrder[]
  onAvailabilityChange: (tailorId: string, isAvailable: boolean) => void
  onAssignmentApproved: (orderId: string, approved: boolean) => void
  onRoleUpdated: (orderId: string, roleDescription: string) => void
  showToast: (message: string, variant?: 'success' | 'error') => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleToggleAvailability() {
    const next = !tailor.is_available
    startTransition(async () => {
      const result = await toggleTailorAvailability(tailor.id, next)
      if (result.error) {
        showToast(result.error, 'error')
        return
      }
      onAvailabilityChange(tailor.id, next)
      showToast(`${tailor.name} marked as ${next ? 'available' : 'unavailable'}.`)
    })
  }

  return (
    <div className="border border-outline-variant bg-surface-container-lowest">
      <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-outline-variant flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-surface-container flex items-center justify-center shrink-0">
            <span className="font-headline-md text-headline-md text-primary">
              {tailor.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-primary">{tailor.name}</h3>
            <p className="text-label-caps font-label-caps text-on-surface-variant mt-0.5">{tailor.specialty}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-data-mono font-data-mono text-primary font-bold">
              {assignedOrders.length}/{DISPLAY_CAPACITY}
            </p>
            <p className="text-label-caps font-label-caps text-on-surface-variant">orders</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={tailor.is_available}
              disabled={isPending}
              onChange={handleToggleAvailability}
              className="w-4 h-4"
            />
            <span className="text-label-caps font-label-caps text-on-surface-variant">
              {tailor.is_available ? 'AVAILABLE' : 'UNAVAILABLE'}
            </span>
          </label>
        </div>
      </div>

      {assignedOrders.length === 0 ? (
        <div className="px-6 py-6 text-center">
          <p className="text-body-sm font-body-sm text-on-surface-variant">No current assignments.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-outline-variant">
          {assignedOrders.map((order) => (
            <AssignmentRow
              key={order.id}
              order={order}
              onApproved={onAssignmentApproved}
              onRoleUpdated={onRoleUpdated}
              showToast={showToast}
            />
          ))}
        </div>
      )}
    </div>
  )
}
