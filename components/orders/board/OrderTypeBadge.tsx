import type { OrderType } from '@/types/threadflow'

const STYLES: Record<OrderType, { label: string; className: string }> = {
  bespoke: { label: 'Bespoke', className: 'bg-primary-fixed text-on-primary-fixed-variant' },
  collection: { label: 'Collection', className: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
}

export function OrderTypeBadge({ orderType }: { orderType: OrderType }) {
  const cfg = STYLES[orderType]

  return (
    <span className={`text-label-caps font-label-caps px-2 py-0.5 whitespace-nowrap shrink-0 ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}
