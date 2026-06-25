import { daysUntil } from '@/lib/deadline'
import type { BoardOrder } from '@/lib/supabase/orders'

export function AtRiskBanner({ orders }: { orders: BoardOrder[] }) {
  if (orders.length === 0) return null

  return (
    <div className="mb-8 border border-urgent/40 bg-urgent/10">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-urgent/30">
        <span className="material-symbols-outlined text-urgent">warning</span>
        <p className="text-label-caps font-label-caps text-urgent tracking-widest uppercase">
          {orders.length} order{orders.length === 1 ? '' : 's'} at risk of missing deadline
        </p>
      </div>
      <div className="flex flex-col divide-y divide-urgent/20">
        {orders.map((order) => {
          const days = daysUntil(order.deadline)
          return (
            <div key={order.id} className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap">
              <div>
                <p className="text-body-sm font-body-sm font-semibold text-urgent">{order.client_name}</p>
                <p className="text-label-caps font-label-caps text-urgent/80">{order.cloth_type}</p>
              </div>
              <span className="text-label-caps font-label-caps px-2 py-0.5 bg-urgent text-white whitespace-nowrap">
                {days < 0 ? 'OVERDUE' : days === 0 ? 'DUE TODAY' : `${days} DAY${days === 1 ? '' : 'S'} LEFT`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
