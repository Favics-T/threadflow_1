import { DeadlineBadge } from '@/components/ui/DeadlineBadge'
import type { Collection, OrderStatus } from '@/types/threadflow'
import type { BoardOrder } from '@/lib/supabase/orders'

const STATUS_LABEL: Record<OrderStatus, string> = {
  confirmed: 'Confirmed',
  in_production: 'In Production',
  ready: 'Ready',
  delivered: 'Delivered',
}

export function CollectionCard({ collection, orders }: { collection: Collection; orders: BoardOrder[] }) {
  return (
    <div className="border border-outline-variant bg-surface-container-lowest flex flex-col">
      <div className="px-6 py-5 border-b border-outline-variant">
        <h3 className="font-headline-md text-headline-md text-primary mb-2">{collection.name}</h3>
        {collection.description && (
          <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed mb-3">
            {collection.description}
          </p>
        )}
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>
            inventory_2
          </span>
          <span className="text-label-caps font-label-caps text-on-surface-variant">
            {collection.pieces_available} piece{collection.pieces_available === 1 ? '' : 's'} available
          </span>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-3 grow">
        <div className="flex items-center gap-2">
          <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Linked Orders
          </p>
          <span className="bg-surface-container text-on-surface-variant text-label-caps font-label-caps px-2 py-0.5 rounded-full">
            {orders.length}
          </span>
        </div>

        {orders.length === 0 ? (
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            No orders linked yet — finalize a message as a collection order to see it here.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3 border border-outline-variant px-3 py-2.5 flex-wrap">
                <div className="min-w-0">
                  <p className="text-body-sm font-body-sm font-semibold text-primary truncate">{order.client_name}</p>
                  <p className="text-label-caps font-label-caps text-on-surface-variant truncate">{order.cloth_type}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <DeadlineBadge deadline={order.deadline} />
                  <span className="text-label-caps font-label-caps px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant whitespace-nowrap">
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
