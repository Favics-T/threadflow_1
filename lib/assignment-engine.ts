import type { Order, Tailor } from '@/types/threadflow'
import { daysUntil } from './deadline'

const URGENT_THRESHOLD_DAYS = 3

const STOP_WORDS = new Set(['and', 'the', 'for', 'with', 'wear', 'set'])

function getKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[&,()-]/g, ' ')
    .split(/\s+/)
    .map((word) => word.replace(/s$/, ''))
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
}

function specialtyMatches(specialty: string, order: Order): boolean {
  const specialtyWords = new Set(getKeywords(specialty))
  const orderWords = getKeywords(`${order.cloth_type} ${order.description}`)
  return orderWords.some((word) => specialtyWords.has(word))
}

function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

function buildReasoning(params: {
  tailorName: string
  isSpecialtyMatch: boolean
  loadAfterAssignment: number
  daysUntilDeadline: number
  isUrgent: boolean
}): string {
  const { tailorName, isSpecialtyMatch, loadAfterAssignment, daysUntilDeadline, isUrgent } = params

  const specialtyPart = isSpecialtyMatch
    ? 'specialty match'
    : 'no exact specialty match — chosen for availability'
  const loadPart = `lowest load (${pluralize(loadAfterAssignment - 1, 'order')} before this one)`
  const deadlinePart = isUrgent
    ? `URGENT — deadline in ${daysUntilDeadline <= 0 ? 'less than a day' : pluralize(daysUntilDeadline, 'day')}`
    : `deadline in ${pluralize(daysUntilDeadline, 'day')}`

  return `Assigned to ${tailorName} — ${specialtyPart}, ${loadPart}, ${deadlinePart}.`
}

export interface AssignmentSuggestion {
  orderId: string
  clientName: string
  clothType: string
  deadline: string
  daysUntilDeadline: number
  isUrgent: boolean
  tailorId: string
  tailorName: string
  specialtyMatch: boolean
  reasoning: string
}

/**
 * Pure matching function — no IO. Suggests a tailor for every confirmed and
 * tailor-confirmed but unassigned order, closest deadline first. Orders still
 * awaiting tailor confirmation are not eligible yet. Orders with no available
 * tailor are simply omitted from the result.
 */
export function assignTailorsToOrders(orders: Order[], tailors: Tailor[]): AssignmentSuggestion[] {
  const unassigned = orders
    .filter((order) => order.status === 'confirmed' && order.tailor_confirmed)
    .slice()
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))

  const workingLoad = new Map<string, number>(tailors.map((t) => [t.id, t.current_load]))
  const suggestions: AssignmentSuggestion[] = []

  for (const order of unassigned) {
    const available = tailors.filter((t) => t.is_available)
    if (available.length === 0) continue

    const matched = available.filter((t) => specialtyMatches(t.specialty, order))
    const pool = matched.length > 0 ? matched : available

    const chosen = pool.reduce((best, candidate) => {
      const candidateLoad = workingLoad.get(candidate.id) ?? candidate.current_load
      const bestLoad = workingLoad.get(best.id) ?? best.current_load
      return candidateLoad < bestLoad ? candidate : best
    })

    const daysUntilDeadline = daysUntil(order.deadline)
    const isUrgent = daysUntilDeadline < URGENT_THRESHOLD_DAYS
    const newLoad = (workingLoad.get(chosen.id) ?? chosen.current_load) + 1
    workingLoad.set(chosen.id, newLoad)

    suggestions.push({
      orderId: order.id,
      clientName: order.client_name,
      clothType: order.cloth_type,
      deadline: order.deadline,
      daysUntilDeadline,
      isUrgent,
      tailorId: chosen.id,
      tailorName: chosen.name,
      specialtyMatch: matched.length > 0,
      reasoning: buildReasoning({
        tailorName: chosen.name,
        isSpecialtyMatch: matched.length > 0,
        loadAfterAssignment: newLoad,
        daysUntilDeadline,
        isUrgent,
      }),
    })
  }

  return suggestions
}

/**
 * Same matching logic as assignTailorsToOrders, but for a single order against
 * live tailor load — used where the owner wants to see the agent suggest one
 * tailor on demand (e.g. the Orders board) rather than batch-suggesting everything.
 */
export function suggestTailorForOrder(order: Order, tailors: Tailor[]): AssignmentSuggestion | null {
  const available = tailors.filter((t) => t.is_available)
  if (available.length === 0) return null

  const matched = available.filter((t) => specialtyMatches(t.specialty, order))
  const pool = matched.length > 0 ? matched : available

  const chosen = pool.reduce((best, candidate) => (candidate.current_load < best.current_load ? candidate : best))

  const daysUntilDeadline = daysUntil(order.deadline)
  const isUrgent = daysUntilDeadline < URGENT_THRESHOLD_DAYS
  const loadAfterAssignment = chosen.current_load + 1

  return {
    orderId: order.id,
    clientName: order.client_name,
    clothType: order.cloth_type,
    deadline: order.deadline,
    daysUntilDeadline,
    isUrgent,
    tailorId: chosen.id,
    tailorName: chosen.name,
    specialtyMatch: matched.length > 0,
    reasoning: buildReasoning({
      tailorName: chosen.name,
      isSpecialtyMatch: matched.length > 0,
      loadAfterAssignment,
      daysUntilDeadline,
      isUrgent,
    }),
  }
}

/**
 * The 3-day buffer rule: any order due within 3 days that hasn't reached
 * "ready" (or "delivered") yet is at risk of missing its deadline.
 */
export function getAtRiskOrders<T extends Order>(orders: T[]): T[] {
  return orders
    .filter((order) => order.status !== 'ready' && order.status !== 'delivered')
    .filter((order) => daysUntil(order.deadline) <= URGENT_THRESHOLD_DAYS)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
}
