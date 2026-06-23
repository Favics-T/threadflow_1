'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { ClientOrder } from '@/app/clients/types'

const statusStyles: Record<string, string> = {
  in_progress: 'bg-primary-fixed text-on-primary-fixed-variant',
  pending: 'bg-surface-container text-on-surface-variant',
  blocked: 'bg-error-container text-on-error-container',
  completed: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Not scheduled'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function statusLabel(status: string | null) {
  return (status ?? 'pending').replaceAll('_', ' ').toUpperCase()
}

type OrderCardProps = {
  order: ClientOrder
}

export function OrderCard({ order }: OrderCardProps) {
  const [open, setOpen] = useState(false)
  const status = order.status ?? 'pending'

  return (
    <article className="bg-surface-container-lowest">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-5 px-5 py-4 text-left transition-colors hover:bg-surface-container-low"
      >
        <span className="min-w-0">
          <span className="block truncate text-body-sm font-body-sm font-semibold text-primary">
            {order.garment_type ?? 'Untitled garment'}
          </span>
          <span className="mt-1 block truncate text-body-sm font-body-sm text-on-surface-variant">
            {order.fabric_inventory?.material_name ?? 'Fabric not assigned'} ·{' '}
            {order.tailors?.name ?? 'Tailor not assigned'}
          </span>
        </span>
        <span
          className={`px-3 py-1 text-label-caps font-label-caps uppercase tracking-widest ${
            statusStyles[status] ?? statusStyles.pending
          }`}
        >
          {statusLabel(status)}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open ? (
        <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-6 border-t border-outline-variant/30 bg-surface-container-low px-5 py-5">
          <div className="flex aspect-[3/4] items-center justify-center border border-outline-variant bg-surface-container-lowest">
            {order.image_url ? (
              <Image
                src={order.image_url}
                alt={order.garment_type ?? 'Outfit reference'}
                width={360}
                height={480}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="px-4 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                  image
                </span>
                <p className="mt-2 text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                  No image
                </p>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <table className="w-full text-left">
              <tbody className="divide-y divide-outline-variant/30">
                <tr>
                  <th className="w-44 py-3 pr-4 text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                    Delivery
                  </th>
                  <td className="py-3 text-data-mono font-data-mono text-primary">
                    {formatDate(order.delivery_estimate)}
                  </td>
                </tr>
                <tr>
                  <th className="py-3 pr-4 text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                    Yardage
                  </th>
                  <td className="py-3 text-body-sm font-body-sm text-primary">
                    {order.yards_required ?? '—'} yards
                  </td>
                </tr>
                <tr>
                  <th className="py-3 pr-4 text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                    Fabric
                  </th>
                  <td className="py-3 text-body-sm font-body-sm text-primary">
                    {order.fabric_inventory?.material_name ?? 'Not assigned'}
                  </td>
                </tr>
                <tr>
                  <th className="py-3 pr-4 text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                    Tailor
                  </th>
                  <td className="py-3 text-body-sm font-body-sm text-primary">
                    {order.tailors?.name ?? 'Not assigned'}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-5 border border-outline-variant bg-surface-container-lowest p-4">
              <p className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                Notes
              </p>
              <p className="mt-2 whitespace-pre-wrap text-body-sm font-body-sm text-primary">
                {order.notes ?? 'No notes recorded for this order.'}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  )
}
