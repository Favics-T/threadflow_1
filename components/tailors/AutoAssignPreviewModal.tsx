'use client'

import { useTransition } from 'react'
import { confirmAutoAssignments, type CreatedAssignment } from '@/app/tailors/actions'
import type { AssignmentSuggestion } from '@/lib/assignment-engine'

export function AutoAssignPreviewModal({
  suggestions,
  unassignedCount,
  onClose,
  onConfirmed,
  showToast,
}: {
  suggestions: AssignmentSuggestion[]
  unassignedCount: number
  onClose: () => void
  onConfirmed: (assignments: CreatedAssignment[]) => void
  showToast: (message: string, variant?: 'success' | 'error') => void
}) {
  const [isPending, startTransition] = useTransition()
  const skipped = unassignedCount - suggestions.length

  function handleConfirm() {
    startTransition(async () => {
      const result = await confirmAutoAssignments(
        suggestions.map((s) => ({
          orderId: s.orderId,
          tailorId: s.tailorId,
          roleDescription: `Primary tailor for ${s.clothType}`,
        }))
      )
      if (result.error || !result.data) {
        showToast(result.error ?? 'Something went wrong.', 'error')
        return
      }
      onConfirmed(result.data)
      showToast(`${suggestions.length} assignment${suggestions.length === 1 ? '' : 's'} applied.`)
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-surface-container-lowest border border-outline-variant shadow-2xl flex flex-col">
        <div className="flex items-center justify-between gap-4 px-8 py-7 border-b border-outline-variant bg-surface-container-low">
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">Auto-Assign Preview</p>
            <h2 className="font-headline-md text-headline-md text-primary">
              Here are the suggested assignments — confirm to apply
            </h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-high transition-colors shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-3">
          {suggestions.length === 0 ? (
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              No available tailors found for any unassigned order.
            </p>
          ) : (
            suggestions.map((s) => (
              <div
                key={s.orderId}
                className={`border px-5 py-4 ${
                  s.isUrgent ? 'border-error-container bg-error-container/20' : 'border-outline-variant'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <p className="text-body-sm font-body-sm font-semibold text-primary">
                    {s.clientName} — {s.clothType}
                  </p>
                  {s.isUrgent && (
                    <span className="text-label-caps font-label-caps px-2 py-0.5 bg-error text-on-error whitespace-nowrap">
                      URGENT
                    </span>
                  )}
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">{s.reasoning}</p>
              </div>
            ))
          )}

          {skipped > 0 && (
            <p className="text-body-sm font-body-sm text-on-surface-variant italic">
              {skipped} order{skipped === 1 ? '' : 's'} could not be matched — no available tailor found.
            </p>
          )}
        </div>

        <div className="px-8 py-6 border-t border-outline-variant bg-surface-container-low/40 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-outline-variant text-on-surface-variant text-label-caps font-label-caps hover:bg-surface-container transition-colors">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending || suggestions.length === 0}
            className="flex-1 py-3 bg-primary text-on-primary text-label-caps font-label-caps hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? 'Applying…' : `Confirm ${suggestions.length} Assignment${suggestions.length === 1 ? '' : 's'}`}
          </button>
        </div>
      </div>
    </div>
  )
}
