'use client'

import Link from 'next/link'
import { PipelineSection } from './PipelineSection'
import { mockFinalizedOrders } from '@/lib/mock/conversations'
import type { ProductionStatus } from '@/lib/types/conversations'

type StatusConfig = {
  label: string
  className: string
}

const PRODUCTION_STATUS_STYLE: Record<ProductionStatus, StatusConfig> = {
  unassigned:        { label: 'UNASSIGNED',         className: 'bg-surface-container text-on-surface-variant' },
  assigned:          { label: 'ASSIGNED',            className: 'bg-primary-fixed text-on-primary-fixed-variant' },
  in_production:     { label: 'IN PRODUCTION',       className: 'bg-primary-fixed text-on-primary-fixed-variant' },
  quality_control:   { label: 'QUALITY CONTROL',     className: 'bg-amber-50 text-amber-800' },
  ready_for_delivery:{ label: 'READY FOR DELIVERY',  className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  delivered:         { label: 'DELIVERED',            className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
}

export function FinalizedOrders() {
  const orders = mockFinalizedOrders

  return (
    <PipelineSection
      label="Finalized Orders"
      count={orders.length}
      description="Confirmed production orders — assign a tailor and move them into the production pipeline."
    >
      {orders.map((order) => {
        const status = PRODUCTION_STATUS_STYLE[order.productionStatus]

        return (
          <div
            key={order.id}
            className="border bg-surface-container-lowest border-outline-variant"
          >
            {/* Card body */}
            <div className="flex items-center gap-4 px-6 py-5">
              {/* Order info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <p className="text-body-sm font-body-sm font-semibold text-primary">
                    {order.clientName}
                  </p>
                  <span className={`text-label-caps font-label-caps px-2 py-0.5 ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                  {/* Garment type */}
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-on-surface-variant"
                      style={{ fontSize: '15px' }}
                    >
                      checkroom
                    </span>
                    <span className="text-body-sm font-body-sm text-on-surface">
                      {order.garmentType}
                    </span>
                  </div>

                  {/* Agreed delivery date */}
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-on-surface-variant"
                      style={{ fontSize: '15px' }}
                    >
                      calendar_today
                    </span>
                    <span className="text-body-sm font-body-sm text-on-surface-variant">
                      Due {order.agreedDeliveryDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action row */}
            <div className="flex items-center gap-3 px-6 py-3 border-t border-outline-variant bg-surface-container-low/40">
              <Link
                id={`view-order-${order.id}`}
                href={`/orders/${order.id}`}
                className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">receipt_long</span>
                VIEW ORDER
              </Link>
              <Link
                id={`assign-tailor-${order.id}`}
                href={`/agent?prompt=${encodeURIComponent(
                  `Who should I assign the order for ${order.garmentType} from ${order.clientName} to?`
                )}`}
                className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant px-4 py-2 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                ASSIGN TAILOR
              </Link>
            </div>
          </div>
        )
      })}
    </PipelineSection>
  )
}
