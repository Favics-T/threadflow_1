import type { StatCard } from '@/lib/types/dashboard'

const subVariantStyles = {
  default: 'text-gray-400',
  danger: 'text-red-500',
  success: 'text-emerald-600',
}

function StatCardItem({ label, value, sub, subVariant = 'default', icon }: StatCard) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
        <i className={`ti ti-${icon} text-sm`} aria-hidden="true" />
        {label}
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className={`text-[11px] mt-0.5 ${subVariantStyles[subVariant]}`}>{sub}</div>
    </div>
  )
}

const stats: StatCard[] = [
  {
    label: 'Active Orders',
    value: 2,
    sub: '1 in progress · 1 pending',
    icon: 'clock',
  },
  {
    label: 'Fabric Alerts',
    value: 1,
    sub: 'Silk Charmeuse low',
    subVariant: 'danger',
    icon: 'stack',
  },
  {
    label: 'Tailor Load',
    value: 3,
    sub: '1 tailor available',
    subVariant: 'success',
    icon: 'shirt',
  },
  {
    label: 'Pending Replies',
    value: 1,
    sub: 'Awaiting approval',
    icon: 'message',
  },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {stats.map((stat) => (
        <StatCardItem key={stat.label} {...stat} />
      ))}
    </div>
  )
}