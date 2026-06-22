import { StatCards } from '@/components/dashboard/StatCards'
import { OrdersTable } from '@/components/dashboard/OrderTable'
import { ActivityLog } from '@/components/dashboard/ActivityLog'
import { ApprovalGate } from '@/components/dashboard/ApprovalGate'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function DashboardPage() {
  const greeting = getGreeting()
  const date = getFormattedDate()

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      {/* Greeting */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs text-gray-400 mb-1">{date}</p>
          <h1 className="text-2xl font-semibold text-gray-900">
            {greeting},{' '}
            <span className="text-emerald-500">Taiwo</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-2 hover:bg-white transition-colors">
            <i className="ti ti-share text-sm" aria-hidden="true" />
            Share
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-2 hover:bg-white transition-colors">
            <i className="ti ti-calendar text-sm" aria-hidden="true" />
            Schedule
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <StatCards />

      {/* Main content grid */}
      <div className="grid grid-cols-[1fr_280px] gap-4">
        {/* Left — orders table */}
        <OrdersTable />

        {/* Right — activity + approval */}
        <div className="flex flex-col gap-4">
          <ActivityLog />
          <ApprovalGate />
        </div>
      </div>
    </div>
  )
}