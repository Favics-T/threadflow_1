'use client'

import Link from 'next/link'

type RecentOrderProps = {
  id: string
  status: string
  garmentType: string
  deliveryEstimate: string
  createdAt: string | null
  clientName: string
  fabricName: string
  tailorName: string
}

const statusStyle: Record<string, string> = {
  in_progress: 'bg-primary-fixed text-on-primary-fixed-variant',
  pending: 'bg-surface-container text-on-surface-variant',
  blocked: 'bg-error-container text-on-error-container',
  completed: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
}

export function RecentOrders({ orders }: { orders: RecentOrderProps[] }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-1">
            Recent Orders
          </h2>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Latest live orders from your studio database.
          </p>
        </div>
        <Link
          href="/orders/history"
          className="flex items-center gap-1 text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors"
        >
          VIEW ORDER HISTORY
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-outline-variant bg-surface-container-lowest p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-body-sm font-body-sm text-on-surface-variant uppercase tracking-widest">
                  {order.clientName}
                </p>
                <h3 className="font-headline-sm text-headline-sm text-primary mt-1">
                  {order.garmentType}
                </h3>
              </div>
              <span className={`inline-block px-3 py-1 text-label-caps font-label-caps ${statusStyle[order.status] ?? statusStyle.pending}`}>
                {order.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-1">
                  Fabric
                </p>
                <p className="text-body-sm font-body-sm text-primary">{order.fabricName}</p>
              </div>
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-1">
                  Tailor
                </p>
                <p className="text-body-sm font-body-sm text-primary">{order.tailorName}</p>
              </div>
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-1">
                  Delivery Estimate
                </p>
                <p className="text-body-sm font-body-sm text-primary">{order.deliveryEstimate}</p>
              </div>
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-1">
                  Created
                </p>
                <p className="text-body-sm font-body-sm text-primary">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
