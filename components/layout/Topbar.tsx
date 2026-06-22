'use client'

export function Topbar() {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3">
      <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
        <i className="ti ti-search text-gray-400 text-sm" aria-hidden="true" />
        <span className="text-sm text-gray-400">Search clients, orders, fabric…</span>
      </div>

      <button
        className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Notifications"
      >
        <i className="ti ti-bell text-gray-500 text-base" aria-hidden="true" />
      </button>

      <button className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
        <i className="ti ti-plus text-sm" aria-hidden="true" />
        New Order
      </button>
    </header>
  )
}