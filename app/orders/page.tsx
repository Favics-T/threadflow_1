import Link from 'next/link'
import { PlatformConnections } from '@/components/orders/PlatformConnections'
import { UnrespondedMessages } from '@/components/orders/conversations/UnrespondedMessages'
import { CommunicationInProgress } from '@/components/orders/conversations/CommunicationInProgress'
import { FinalizedOrders } from '@/components/orders/conversations/FinalizedOrders'

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
            Your studio's live order pipeline — from first inquiry through to final delivery.
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

      {/* ── Pipeline ─────────────────────────────────────────────────────────── */}

      {/* Stage 1: Unresponded Messages */}
      <UnrespondedMessages />

      {/* Stage 2: Communication In Progress */}
      <CommunicationInProgress />

      {/* Stage 3: Finalized Orders */}
      <FinalizedOrders />

    </main>
  )
}
