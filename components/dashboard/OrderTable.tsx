'use client'

import { useState } from 'react'
import type { Order, OrderStatus } from '@/lib/types/dashboard'

const orders: Order[] = [
  {
    id: '1',
    clientName: 'Adaeze Okonkwo',
    clientInitials: 'AO',
    fabric: 'Ankara Print',
    tailor: 'Tunde',
    tailorLoad: 'low',
    status: 'in_progress',
    delivery: 'Jun 28',
  },
  {
    id: '2',
    clientName: 'Chiamaka Eze',
    clientInitials: 'CE',
    fabric: 'Silk Charmeuse',
    tailor: 'Grace',
    tailorLoad: 'high',
    status: 'blocked',
    delivery: 'Fabric short',
  },
]

const statusStyles: Record<OrderStatus, string> = {
  in_progress: 'bg-blue-50 text-blue-700',
  pending: 'bg-amber-50 text-amber-700',
  blocked: 'bg-red-50 text-red-700',
  completed: 'bg-emerald-50 text-emerald-700',
}

const statusLabels: Record<OrderStatus, string> = {
  in_progress: 'In Progress',
  pending: 'Pending',
  blocked: 'Blocked',
  completed: 'Completed',
}

const tailorDotStyles = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-400',
  high: 'bg-red-400',
}

const clientAvatarStyles: Record<string, string> = {
  AO: 'bg-emerald-50 text-emerald-800',
  CE: 'bg-amber-50 text-amber-800',
  BA: 'bg-blue-50 text-blue-800',
}

type FilterTab = 'all' | OrderStatus

const filters: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Pending', value: 'pending' },
  { label: 'Blocked', value: 'blocked' },
]

export function OrdersTable() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  const filtered = activeFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === activeFilter)

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-900">Active Orders</h2>
          <div className="flex gap-1.5">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors
                  ${activeFilter === f.value
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'border-gray-100 text-gray-500 hover:bg-gray-50'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <button className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors">
          See all
        </button>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {['Client', 'Fabric', 'Tailor', 'Status', 'Delivery', ''].map((h) => (
              <th
                key={h}
                className="text-left text-[11px] text-gray-400 font-medium pb-2.5 pr-4 last:pr-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((order) => (
            <tr key={order.id} className="border-b border-gray-50 last:border-none">
              {/* Client */}
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold flex-shrink-0 ${clientAvatarStyles[order.clientInitials] ?? 'bg-gray-100 text-gray-600'}`}>
                    {order.clientInitials}
                  </div>
                  <span className="text-sm text-gray-800 whitespace-nowrap">{order.clientName}</span>
                </div>
              </td>

              {/* Fabric */}
              <td className="py-3 pr-4 text-sm text-gray-600">{order.fabric}</td>

              {/* Tailor */}
              <td className="py-3 pr-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tailorDotStyles[order.tailorLoad]}`} />
                  {order.tailor}
                </div>
              </td>

              {/* Status */}
              <td className="py-3 pr-4">
                <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyles[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </td>

              {/* Delivery */}
              <td className={`py-3 pr-4 text-xs ${order.status === 'blocked' ? 'text-red-500' : 'text-gray-400'}`}>
                {order.delivery}
              </td>

              {/* AI action */}
              <td className="py-3">
                <button className="inline-flex items-center gap-1 text-[11px] text-emerald-600 border border-emerald-200 rounded-full px-2 py-1 hover:bg-emerald-50 transition-colors">
                  <i className="ti ti-robot text-xs" aria-hidden="true" />
                  Ask AI
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}