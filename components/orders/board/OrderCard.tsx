'use client'

import { DeadlineBadge } from '@/components/ui/DeadlineBadge'
import { OrderTypeBadge } from './OrderTypeBadge'
import type { BoardOrder } from '@/lib/supabase/orders'

export function OrderCard({ order, onClick }: { order: BoardOrder; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors px-5 py-4"
    >
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <OrderTypeBadge orderType={order.order_type} />
        <DeadlineBadge deadline={order.deadline} />
      </div>

      <p className="text-body-sm font-body-sm font-semibold text-primary mb-1">{order.client_name}</p>
      <p className="text-body-sm font-body-sm text-on-surface mb-1">{order.cloth_type}</p>

      {order.description && (
        <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2 mb-3">{order.description}</p>
      )}

      {order.assignment ? (
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '14px' }}>
            person
          </span>
          <span className="text-label-caps font-label-caps text-on-surface-variant">
            {order.assignment.tailorName}
          </span>
        </div>
      ) : !order.tailor_confirmed ? (
        <span className="text-label-caps font-label-caps px-2 py-0.5 bg-warning/10 text-warning">
          NEEDS CONFIRMATION
        </span>
      ) : (
        <span className="text-label-caps font-label-caps px-2 py-0.5 bg-surface-container text-on-surface-variant">
          UNASSIGNED
        </span>
      )}
    </button>
  )
}
