'use client'

import { useState } from 'react'
import type { StudioClient } from '@/app/clients/types'
import { MeasurementsEditor } from './MeasurementsEditor'
import { OrderCard } from './OrderCard'

type Props = {
  client: StudioClient | null
  onAddOrder: () => void
}

export function ClientDetail({ client, onAddOrder }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'measurements' | 'orders'>('overview')

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-10">
        <span className="material-symbols-outlined text-4xl text-outline-variant">person</span>
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Select a client to view their profile.
        </p>
      </div>
    )
  }

  const initials = client.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const joinedDate = client.created_at
    ? new Date(client.created_at).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—'

  const tabs = [
    { id: 'overview',     label: 'Overview'     },
    { id: 'measurements', label: 'Measurements' },
    { id: 'orders',       label: `Orders (${client.orders.length})` },
  ] as const

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Client header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant bg-surface-container-low">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-surface-container-highest flex items-center justify-center flex-shrink-0">
            <span className="font-headline-md text-headline-md text-primary">{initials}</span>
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">{client.name}</h2>
            <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
              {client.phone ?? 'No phone'} · Joined {joinedDate}
            </p>
          </div>
        </div>
        <button
          onClick={onAddOrder}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          NEW ORDER
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant px-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 text-label-caps font-label-caps tracking-widest transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-primary border-primary'
                : 'text-on-surface-variant border-transparent hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 px-8 py-6">

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Orders',     value: client.orders.length },
                { label: 'In Progress',      value: client.orders.filter((o) => o.status === 'in_progress').length },
                { label: 'Completed',        value: client.orders.filter((o) => o.status === 'completed').length },
              ].map((stat) => (
                <div key={stat.label} className="border border-outline-variant bg-surface-container-lowest p-5">
                  <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-2">
                    {stat.label}
                  </p>
                  <p className="font-headline-md text-headline-md text-primary">{stat.value}</p>
                </div>
              ))}
            </div>

            {client.orders.length > 0 && (
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-4">
                  Recent Orders
                </p>
                <div className="flex flex-col gap-3">
                  {client.orders.slice(0, 3).map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Measurements */}
        {activeTab === 'measurements' && (
          <MeasurementsEditor client={client} />
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-3">
            {client.orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <span className="material-symbols-outlined text-4xl text-outline-variant">receipt_long</span>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  No orders yet for this client.
                </p>
                <button
                  onClick={onAddOrder}
                  className="mt-2 text-label-caps font-label-caps text-primary underline underline-offset-4"
                >
                  Create first order
                </button>
              </div>
            ) : (
              client.orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}