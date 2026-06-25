import { daysUntil } from '@/lib/deadline'
import type { BoardOrder } from '@/lib/supabase/orders'

export function AtRiskBanner({ orders }: { orders: BoardOrder[] }) {
  if (orders.length === 0) return null

  return (
    <div className="mb-8 border border-error-container bg-error-container/30">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-error-container/60">
        <span className="material-symbols-outlined text-on-error-container">warning</span>
        <p className="text-label-caps font-label-caps text-on-error-container tracking-widest uppercase">
          {orders.length} order{orders.length === 1 ? '' : 's'} at risk of missing deadline
        </p>
      </div>
      <div className="flex flex-col divide-y divide-error-container/60">
        {orders.map((order) => {
          const days = daysUntil(order.deadline)
          return (
            <div key={order.id} className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap">
              <div>
                <p className="text-body-sm font-body-sm font-semibold text-on-error-container">{order.client_name}</p>
                <p className="text-label-caps font-label-caps text-on-error-container/80">{order.cloth_type}</p>
              </div>
              <span className="text-label-caps font-label-caps px-2 py-0.5 bg-error text-on-error whitespace-nowrap">
                {days < 0 ? 'OVERDUE' : days === 0 ? 'DUE TODAY' : `${days} DAY${days === 1 ? '' : 'S'} LEFT`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
