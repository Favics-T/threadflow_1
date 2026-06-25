import type { MessageCategory } from '@/types/threadflow'

const CATEGORY_CONFIG: Record<MessageCategory, { label: string; className: string }> = {
  enquiry: { label: 'Enquiry', className: 'bg-surface-container text-on-surface-variant' },
  negotiation: { label: 'Negotiation', className: 'bg-primary-fixed text-on-primary-fixed-variant' },
  order_confirmation: { label: 'Order Confirmation', className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  complaint: { label: 'Complaint', className: 'bg-error-container text-on-error-container' },
}

export function CategoryTag({ category }: { category: MessageCategory }) {
  const cfg = CATEGORY_CONFIG[category]

  return (
    <span className={`text-label-caps font-label-caps px-2 py-0.5 whitespace-nowrap shrink-0 ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}
