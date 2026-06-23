'use client'

import { useState } from 'react'
import type { ClientOrder } from '@/app/clients/types'

const statusStyle: Record<string, string> = {
  in_progress: 'bg-primary-fixed text-on-primary-fixed-variant',
  pending:     'bg-surface-container text-on-surface-variant',
  blocked:     'bg-error-container text-on-error-container',
  completed:   'bg-tertiary-fixed text-on-tertiary-fixed-variant',
}

export function OrderCard({ order }: { order: ClientOrder }) {
  const [expanded, setExpanded] = useState(false)

  const dateStr = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—'

  return (
    <div className="border border-outline-variant bg-surface-container-lowest">
      {/* Collapsed row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-container-low transition-colors text-left"
      >
        <div className="flex-1">
          <p className="text-body-sm font-body-sm font-semibold text-primary">
            {order.garment_type ?? 'Unnamed Garment'}
          </p>
          <p className="text-label-caps font-label-caps text-on-surface-variant mt-0.5">
            {dateStr} · {order.fabric_inventory?.material_name ?? 'No fabric assigned'}
          </p>
        </div>
        <span className={`inline-block px-3 py-1 text-label-caps font-label-caps ${statusStyle[order.status ?? 'pending'] ?? statusStyle.pending}`}>
          {(order.status ?? 'pending').replace('_', ' ').toUpperCase()}
        </span>
        <span
          className="material-symbols-outlined text-on-surface-variant text-sm transition-transform duration-300"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-outline-variant bg-surface-container-low/40">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            {[
              { label: 'Tailor',            value: order.tailors?.name ?? '—' },
              { label: 'Fabric Required',   value: order.yards_required ? `${order.yards_required} yds` : '—' },
              { label: 'Delivery Estimate', value: order.delivery_estimate ?? '—' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-1">
                  {item.label}
                </p>
                <p className="text-body-sm font-body-sm text-primary font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          {order.notes && (
            <div className="mt-4 pt-4 border-t border-outline-variant">
              <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-1">Notes</p>
              <p className="text-body-sm font-body-sm text-on-surface italic">{order.notes}</p>
            </div>
          )}

          {order.image_url && (
            <div className="mt-4 pt-4 border-t border-outline-variant">
              <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-3">Outfit Reference</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={order.image_url}
                alt={order.garment_type ?? 'Outfit'}
                className="w-full max-w-xs object-cover border border-outline-variant"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}