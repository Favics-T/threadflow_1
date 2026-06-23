import { MeasurementsEditor } from './MeasurementsEditor'
import { OrderCard } from './OrderCard'
import type { StudioClient } from '@/app/clients/types'

function formatDate(value: string | null) {
  if (!value) {
    return 'Not recorded'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

type ClientDetailProps = {
  client: StudioClient | null
  onAddOrder: () => void
}

export function ClientDetail({ client, onAddOrder }: ClientDetailProps) {
  if (!client) {
    return (
      <section className="flex min-h-[680px] flex-col items-center justify-center px-8 text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant">
          person_search
        </span>
        <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant">
          Select or add a client to begin.
        </p>
      </section>
    )
  }

  return (
    <section className="min-w-0 bg-surface-container-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-8 py-6">
        <div>
          <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
            Client File
          </span>
          <h2 className="mt-0.5 font-headline-md text-headline-md text-primary">
            {client.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onAddOrder}
          className="flex items-center gap-2 bg-primary px-6 py-3 text-label-caps font-label-caps uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90"
        >
          <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
          Add Order
        </button>
      </div>

      <div className="grid grid-cols-1 divide-y divide-outline-variant/30">
        <section className="px-8 py-7">
          <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
            Profile
          </span>
          <h3 className="mt-0.5 font-headline-md text-headline-md text-primary">
            Contact Record
          </h3>

          <dl className="mt-5 grid grid-cols-3 divide-x divide-outline-variant/30 border border-outline-variant">
            <div className="px-5 py-4">
              <dt className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                Name
              </dt>
              <dd className="mt-2 text-body-sm font-body-sm text-primary">{client.name}</dd>
            </div>
            <div className="px-5 py-4">
              <dt className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                Phone
              </dt>
              <dd className="mt-2 text-body-sm font-body-sm text-primary">
                {client.phone ?? 'Not recorded'}
              </dd>
            </div>
            <div className="px-5 py-4">
              <dt className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                Created
              </dt>
              <dd className="mt-2 text-data-mono font-data-mono text-primary">
                {formatDate(client.created_at)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="px-8 py-7">
          <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
            Measurements
          </span>
          <h3 className="mt-0.5 font-headline-md text-headline-md text-primary">
            Fit Profile
          </h3>
          <MeasurementsEditor clientId={client.id} measurements={client.measurements ?? {}} />
        </section>

        <section className="px-8 py-7">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                Order History
              </span>
              <h3 className="mt-0.5 font-headline-md text-headline-md text-primary">
                Garments In Motion
              </h3>
            </div>
            <span className="text-data-mono font-data-mono text-on-surface-variant">
              {client.orders.length} ORDERS
            </span>
          </div>

          {client.orders.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center border border-outline-variant bg-surface-container-low px-8 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                apparel
              </span>
              <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant">
                No orders recorded for this client.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/30 border border-outline-variant">
              {client.orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  )
}
