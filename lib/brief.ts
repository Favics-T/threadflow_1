import { daysUntil } from './deadline'
import { getAtRiskOrders } from './assignment-engine'
import { getTailorLoad } from './supabase/orders'
import type { BoardOrder } from './supabase/orders'
import type { Message, Tailor } from '@/types/threadflow'

const HIGH_LOAD_THRESHOLD = 3
const WEEK_WINDOW_DAYS = 7

export interface BriefSnapshot {
  unrespondedMessages: { clientName: string; source: string; preview: string }[]
  inProductionThisWeek: { clientName: string; clothType: string; deadline: string; daysLeft: number }[]
  atRiskOrders: { clientName: string; clothType: string; deadline: string; daysLeft: number }[]
  highLoadTailors: { name: string; load: number }[]
  completedThisWeek: { clientName: string; clothType: string }[]
}

export function buildBriefSnapshot(messages: Message[], orders: BoardOrder[], tailors: Tailor[]): BriefSnapshot {
  const unresponded = messages.filter((m) => m.status === 'unresponded')
  const inProduction = orders.filter((o) => o.status === 'in_production' && daysUntil(o.deadline) <= WEEK_WINDOW_DAYS)
  const atRisk = getAtRiskOrders(orders)
  const completed = orders.filter((o) => o.status === 'delivered')

  const highLoadTailors = tailors
    .map((t) => ({ name: t.name, load: getTailorLoad(t.id, orders) }))
    .filter((t) => t.load > HIGH_LOAD_THRESHOLD)

  return {
    unrespondedMessages: unresponded.map((m) => ({
      clientName: m.client_name,
      source: m.source,
      preview: m.content.slice(0, 140),
    })),
    inProductionThisWeek: inProduction.map((o) => ({
      clientName: o.client_name,
      clothType: o.cloth_type,
      deadline: o.deadline,
      daysLeft: daysUntil(o.deadline),
    })),
    atRiskOrders: atRisk.map((o) => ({
      clientName: o.client_name,
      clothType: o.cloth_type,
      deadline: o.deadline,
      daysLeft: daysUntil(o.deadline),
    })),
    highLoadTailors,
    completedThisWeek: completed.map((o) => ({ clientName: o.client_name, clothType: o.cloth_type })),
  }
}

function section(label: string, lines: string[]): string {
  return `${label}:\n${lines.length > 0 ? lines.join('\n') : '(none)'}`
}

export function buildBriefPrompt(snapshot: BriefSnapshot): string {
  return [
    section(
      `UNRESPONDED MESSAGES (${snapshot.unrespondedMessages.length})`,
      snapshot.unrespondedMessages.map((m) => `- ${m.clientName} via ${m.source}: "${m.preview}"`)
    ),
    section(
      'ORDERS IN PRODUCTION THIS WEEK',
      snapshot.inProductionThisWeek.map(
        (o) => `- ${o.clientName} — ${o.clothType}, due ${o.deadline} (${o.daysLeft} day${o.daysLeft === 1 ? '' : 's'} left)`
      )
    ),
    section(
      'AT_RISK ORDERS (deadline within 3 days, not ready)',
      snapshot.atRiskOrders.map(
        (o) => `- ${o.clientName} — ${o.clothType}, due ${o.deadline} (${o.daysLeft} day${o.daysLeft === 1 ? '' : 's'} left)`
      )
    ),
    section(
      'TAILORS WITH HIGH LOAD (>3 orders)',
      snapshot.highLoadTailors.map((t) => `- ${t.name}: ${t.load} orders`)
    ),
    section(
      'ORDERS COMPLETED THIS WEEK',
      snapshot.completedThisWeek.map((o) => `- ${o.clientName} — ${o.clothType}`)
    ),
    'Write the Monday morning briefing now.',
  ].join('\n\n')
}
