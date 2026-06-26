import type { Message } from '@/types/threadflow'

type PillConfig = { label: string; className: string }

const STATUS_PILLS: Record<Message['status'], PillConfig> = {
  unresponded: { label: 'Needs Response', className: 'bg-warning/10 text-warning' },
  responded: { label: 'Awaiting Reply', className: 'bg-blue-50 text-blue-700' },
  finalized: { label: 'Finalized', className: 'bg-success/10 text-success' },
}

const FLAGGED_PILL: PillConfig = { label: 'Flagged · Review', className: 'bg-urgent/10 text-urgent' }

export function StatusPill({ message }: { message: Message }) {
  const pill = message.category === 'complaint' ? FLAGGED_PILL : STATUS_PILLS[message.status]

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-label-caps font-label-caps ${pill.className}`}
    >
      {pill.label}
    </span>
  )
}
