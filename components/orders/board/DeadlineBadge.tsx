import { getDeadlineUrgency, formatDeadline, daysUntil } from '@/lib/deadline'

const URGENCY_STYLES = {
  red: 'bg-error-container text-on-error-container',
  yellow: 'bg-amber-50 text-amber-800',
  green: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
} as const

export function DeadlineBadge({ deadline }: { deadline: string }) {
  const urgency = getDeadlineUrgency(deadline)
  const days = daysUntil(deadline)

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-label-caps font-label-caps whitespace-nowrap shrink-0 ${URGENCY_STYLES[urgency]}`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
        calendar_today
      </span>
      {formatDeadline(deadline)}
      {days < 0 ? ' · overdue' : ''}
    </span>
  )
}
