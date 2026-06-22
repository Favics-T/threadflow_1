import type { ActivityItem } from '@/lib/types/dashboard'

const activities: ActivityItem[] = [
  {
    id: '1',
    message: 'Delivery estimate calculated for Adaeze',
    time: '2 min ago',
    variant: 'success',
    icon: 'check',
  },
  {
    id: '2',
    message: 'Fabric shortage flagged — Silk Charmeuse',
    time: '5 min ago',
    variant: 'danger',
    icon: 'alert-triangle',
  },
  {
    id: '3',
    message: 'Client reply drafted for Adaeze',
    time: '6 min ago',
    variant: 'info',
    icon: 'message',
  },
]

const variantStyles = {
  success: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
  danger: { bg: 'bg-red-50', icon: 'text-red-500' },
  info: { bg: 'bg-blue-50', icon: 'text-blue-600' },
}

function ActivityRow({ message, time, variant, icon }: ActivityItem) {
  const styles = variantStyles[variant]
  return (
    <div className="flex gap-2.5">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${styles.bg}`}>
        <i className={`ti ti-${icon} text-sm ${styles.icon}`} aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm text-gray-700 leading-snug">{message}</p>
        <span className="text-[11px] text-gray-400">{time}</span>
      </div>
    </div>
  )
}

export function ActivityLog() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">AI Activity</h2>
        <button className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors">
          View all
        </button>
      </div>
      <div className="flex flex-col gap-3.5">
        {activities.map((item) => (
          <ActivityRow key={item.id} {...item} />
        ))}
      </div>
    </div>
  )
}