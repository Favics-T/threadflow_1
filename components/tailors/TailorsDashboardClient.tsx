'use client'

import { useState } from 'react'
import { AtRiskBanner } from './AtRiskBanner'
import { TailorCard } from './TailorCard'
import { UnassignedOrdersSection } from './UnassignedOrdersSection'
import { AutoAssignPreviewModal } from './AutoAssignPreviewModal'
import { Toast } from '@/components/ui/Toast'
import { assignTailorsToOrders, getAtRiskOrders, type AssignmentSuggestion } from '@/lib/assignment-engine'
import type { CreatedAssignment } from '@/app/tailors/actions'
import type { Tailor } from '@/types/threadflow'
import type { BoardOrder, BoardOrderAssignment } from '@/lib/supabase/orders'

function withLiveLoad(tailors: Tailor[], orders: BoardOrder[]): Tailor[] {
  return tailors.map((t) => ({
    ...t,
    current_load: orders.filter((o) => o.assignment?.tailorId === t.id && o.status !== 'delivered').length,
  }))
}

export function TailorsDashboardClient({
  initialTailors,
  initialOrders,
  usingMockData,
}: {
  initialTailors: Tailor[]
  initialOrders: BoardOrder[]
  usingMockData: boolean
}) {
  const [tailors, setTailors] = useState<Tailor[]>(initialTailors)
  const [orders, setOrders] = useState<BoardOrder[]>(initialOrders)
  const [autoAssignSuggestions, setAutoAssignSuggestions] = useState<AssignmentSuggestion[] | null>(null)
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null)

  function showToast(message: string, variant: 'success' | 'error' = 'success') {
    setToast({ message, variant })
    setTimeout(() => setToast(null), 3500)
  }

  const liveTailors = withLiveLoad(tailors, orders)
  const atRiskOrders = getAtRiskOrders(orders)
  const unassignedOrders = orders.filter((o) => o.status === 'confirmed')

  function applyAssignment(assignment: CreatedAssignment) {
    const tailor = tailors.find((t) => t.id === assignment.tailor_id)
    if (!tailor) return

    const boardAssignment: BoardOrderAssignment = {
      assignmentId: assignment.id,
      tailorId: assignment.tailor_id,
      tailorName: tailor.name,
      specialty: tailor.specialty,
      roleDescription: assignment.role_description,
      approvedByTailor: assignment.approved_by_tailor,
      editedByTailor: assignment.edited_by_tailor,
      assignedAt: assignment.assigned_at,
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === assignment.order_id ? { ...o, status: 'in_production', assignment: boardAssignment } : o
      )
    )
  }

  function handleAutoAssignClick() {
    if (unassignedOrders.length === 0) {
      showToast('No unassigned orders to assign.', 'error')
      return
    }
    setAutoAssignSuggestions(assignTailorsToOrders(orders, liveTailors))
  }

  return (
    <main className="px-10 py-10 pb-16">
      <header className="flex justify-between items-end mb-10 flex-wrap gap-4">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Studio Floor
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Tailors</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            Workload, assignments, and smart auto-assignment for every tailor.
          </p>
        </div>
        <button
          onClick={handleAutoAssignClick}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm">magic_button</span>
          AUTO-ASSIGN UNASSIGNED ORDERS
        </button>
      </header>

      {usingMockData && (
        <div className="mb-8 flex items-center gap-2 border border-outline-variant bg-surface-container-low px-4 py-3">
          <span className="material-symbols-outlined text-sm text-on-surface-variant">info</span>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Showing demo data — connect the tailors/orders tables in Supabase to see live data.
          </p>
        </div>
      )}

      <AtRiskBanner orders={atRiskOrders} />

      <UnassignedOrdersSection
        orders={unassignedOrders}
        tailors={liveTailors}
        onAssigned={applyAssignment}
        showToast={showToast}
      />

      <section>
        <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-6">
          Workforce
        </h2>
        <div className="flex flex-col gap-5">
          {liveTailors.map((tailor) => (
            <TailorCard
              key={tailor.id}
              tailor={tailor}
              assignedOrders={orders.filter((o) => o.assignment?.tailorId === tailor.id && o.status !== 'delivered')}
              onAvailabilityChange={(tailorId, isAvailable) =>
                setTailors((prev) => prev.map((t) => (t.id === tailorId ? { ...t, is_available: isAvailable } : t)))
              }
              onAssignmentApproved={(orderId, approved) =>
                setOrders((prev) =>
                  prev.map((o) =>
                    o.id === orderId && o.assignment
                      ? { ...o, assignment: { ...o.assignment, approvedByTailor: approved } }
                      : o
                  )
                )
              }
              onRoleUpdated={(orderId, roleDescription) =>
                setOrders((prev) =>
                  prev.map((o) =>
                    o.id === orderId && o.assignment
                      ? { ...o, assignment: { ...o.assignment, roleDescription, editedByTailor: true } }
                      : o
                  )
                )
              }
              showToast={showToast}
            />
          ))}
        </div>
      </section>

      {autoAssignSuggestions && (
        <AutoAssignPreviewModal
          suggestions={autoAssignSuggestions}
          unassignedCount={unassignedOrders.length}
          onClose={() => setAutoAssignSuggestions(null)}
          onConfirmed={(assignments) => {
            assignments.forEach(applyAssignment)
            setAutoAssignSuggestions(null)
          }}
          showToast={showToast}
        />
      )}

      {toast && <Toast message={toast.message} variant={toast.variant} />}
    </main>
  )
}
