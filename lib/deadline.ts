export type DeadlineUrgency = 'red' | 'yellow' | 'green'

export function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(dateStr)
  deadline.setHours(0, 0, 0, 0)
  return Math.round((deadline.getTime() - today.getTime()) / 86400000)
}

export function getDeadlineUrgency(dateStr: string): DeadlineUrgency {
  const days = daysUntil(dateStr)
  if (days <= 3) return 'red'
  if (days <= 7) return 'yellow'
  return 'green'
}

export function formatDeadline(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
