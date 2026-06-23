import Link from 'next/link'
import { PlatformConnections } from '@/components/orders/PlatformConnections'
import { IncomingOrders } from '@/components/orders/IncomingOrders'

export const metadata = {
  title: 'Orders | ThreadFlow AI',
}

export default function OrdersPage() {
  return (
    <main className="px-10 py-10 pb-16">

      {/* Header */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Order Management
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Orders</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            Connect your platforms and ThreadFlow captures every incoming order automatically — no manual entry required.
          </p>
        </div>
        <Link
          href="/orders/history"
          className="flex items-center gap-2 border border-outline-variant text-on-surface-variant px-6 py-2.5 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">receipt_long</span>
          VIEW ALL ORDERS
        </Link>
      </header>

      {/* Platform connections */}
      <PlatformConnections />

      {/* Incoming orders */}
      <IncomingOrders />

    </main>
  )
}