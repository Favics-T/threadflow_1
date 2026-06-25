import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { mockMessages } from '@/lib/mock-data'
import { getOrders, getMockOrders } from '@/lib/supabase/orders'
import { getAtRiskOrders } from '@/lib/assignment-engine'
import { daysUntil } from '@/lib/deadline'
import type { Message } from '@/types/threadflow'

export const metadata: Metadata = {
  // The root layout's title template doesn't apply to a page co-located in the
  // same segment, so the full title is spelled out here.
  title: 'Dashboard | ThreadFlow AI',
}

export default async function HomePage() {
  const supabase = createClient()

  const { data: messagesData, error: messagesError } = await supabase.from('messages').select('*')
  const messages: Message[] = !messagesError && messagesData ? (messagesData as Message[]) : mockMessages

  const { data: ordersData, error: ordersError } = await getOrders()
  const orders = !ordersError && ordersData ? ordersData : getMockOrders()

  const unrespondedCount = messages.filter((m) => m.status === 'unresponded').length
  const inProductionCount = orders.filter((o) => o.status === 'in_production').length
  const dueThisWeekCount = orders.filter((o) => o.status !== 'delivered' && daysUntil(o.deadline) <= 7).length
  const atRiskCount = getAtRiskOrders(orders).length

  const cards = [
    { label: 'Messages Needing Response', value: unrespondedCount, icon: 'mark_chat_unread', href: '/inbox', urgent: false },
    { label: 'Orders In Production', value: inProductionCount, icon: 'precision_manufacturing', href: '/orders', urgent: false },
    { label: 'Orders Due This Week', value: dueThisWeekCount, icon: 'calendar_today', href: '/orders', urgent: false },
    { label: 'AT_RISK Orders', value: atRiskCount, icon: 'warning', href: '/tailors', urgent: atRiskCount > 0 },
  ]

  return (
    <main className="px-10 py-10 pb-16">
      <header className="flex justify-between items-end mb-10 flex-wrap gap-6">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Studio Overview
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Dashboard</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            Where things stand across your studio, right now.
          </p>
        </div>
        <Link
          href="/brief"
          className="flex items-center gap-2 bg-tertiary text-on-tertiary px-6 py-3 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
            auto_awesome
          </span>
          BRIEF ME
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`border bg-surface-container-lowest px-6 py-6 flex flex-col gap-4 transition-colors hover:border-primary ${
              card.urgent ? 'border-urgent/40 bg-urgent/5' : 'border-outline-variant'
            }`}
          >
            <span className={`material-symbols-outlined ${card.urgent ? 'text-urgent' : 'text-on-surface-variant'}`}>
              {card.icon}
            </span>
            <div>
              <p className={`text-data-mono font-data-mono text-4xl font-bold ${card.urgent ? 'text-urgent' : 'text-primary'}`}>
                {card.value}
              </p>
              <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mt-1">
                {card.label}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
