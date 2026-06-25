'use client'

import { useState, useTransition } from 'react'
import { DeadlineBadge } from '@/components/ui/DeadlineBadge'
import { approveAssignment, updateAssignmentRole } from '@/app/tailors/actions'
import type { BoardOrder } from '@/lib/supabase/orders'

export function AssignmentRow({
  order,
  onApproved,
  onRoleUpdated,
  showToast,
}: {
  order: BoardOrder
  onApproved: (orderId: string, approved: boolean) => void
  onRoleUpdated: (orderId: string, roleDescription: string) => void
  showToast: (message: string, variant?: 'success' | 'error') => void
}) {
  const assignment = order.assignment!
  const [isEditing, setIsEditing] = useState(false)
  const [roleText, setRoleText] = useState(assignment.roleDescription ?? '')
  const [isPending, startTransition] = useTransition()

  function handleToggleApproved() {
    const next = !assignment.approvedByTailor
    startTransition(async () => {
      const result = await approveAssignment(assignment.assignmentId, next)
      if (result.error) {
        showToast(result.error, 'error')
        return
      }
      onApproved(order.id, next)
      showToast(next ? `Assignment approved for ${order.client_name}.` : 'Approval removed.')
    })
  }

  function handleSaveRole() {
    startTransition(async () => {
      const result = await updateAssignmentRole(assignment.assignmentId, roleText)
      if (result.error) {
        showToast(result.error, 'error')
        return
      }
      onRoleUpdated(order.id, roleText.trim())
      setIsEditing(false)
      showToast('Role description updated.')
    })
  }

  return (
    <div className="px-6 py-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-body-sm font-body-sm font-semibold text-primary">{order.client_name}</p>
          <p className="text-body-sm font-body-sm text-on-surface-variant">{order.cloth_type}</p>
        </div>
        <DeadlineBadge deadline={order.deadline} />
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={roleText}
            onChange={(e) => setRoleText(e.target.value)}
            rows={2}
            className="w-full bg-surface-container-low border border-outline-variant focus:border-primary outline-none p-2.5 text-body-sm font-body-sm text-on-surface resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveRole}
              disabled={isPending}
              className="px-4 py-1.5 bg-primary text-on-primary text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isPending ? 'SAVING…' : 'SAVE'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setRoleText(assignment.roleDescription ?? '')
              }}
              disabled={isPending}
              className="px-4 py-1.5 border border-outline-variant text-on-surface-variant text-label-caps font-label-caps hover:bg-surface-container transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-body-sm font-body-sm text-on-surface-variant italic">
            {assignment.roleDescription || 'No role description set.'}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-label-caps font-label-caps text-primary hover:underline shrink-0"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            EDIT ROLE
          </button>
        </div>
      )}

      <label className="flex items-center gap-2 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={assignment.approvedByTailor}
          disabled={isPending}
          onChange={handleToggleApproved}
          className="w-4 h-4"
        />
        <span className="text-label-caps font-label-caps text-on-surface-variant">
          {assignment.approvedByTailor ? 'APPROVED BY TAILOR' : 'APPROVE ASSIGNMENT'}
        </span>
      </label>
    </div>
  )
}
