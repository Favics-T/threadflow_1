'use client'

import { useMemo, useState } from 'react'
import { AddClientDrawer } from '@/components/clients/AddClientDrawer'
import { AddOrderDrawer } from '@/components/clients/AddOrderDrawer'
import { ClientDetail } from '@/components/clients/ClientDetail'
import { ClientList } from '@/components/clients/ClientList'
import type { StudioClient } from './types'

type ClientsUIProps = {
  clients: StudioClient[]
  error: string | null
}

export function ClientsUI({ clients, error }: ClientsUIProps) {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id ?? '')
  const [isClientDrawerOpen, setIsClientDrawerOpen] = useState(false)
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false)

  const selectedClient = useMemo(
    () =>
      clients.find((client) => client.id === selectedClientId) ??
      clients[0] ??
      null,
    [clients, selectedClientId]
  )

  return (
    <section className="px-10 py-10 pb-16 bg-white">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
            Client Atelier
          </span>
          <h1 className="mt-1 font-headline-lg text-headline-lg text-primary">
            Clients
          </h1>
          <p className="mt-2 max-w-xl text-body-lg font-body-lg text-on-surface-variant">
            Measurements, client history, and garment production records in one working view.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsClientDrawerOpen(true)}
          className="flex items-center gap-2 bg-primary px-8 py-3 text-label-caps font-label-caps uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add Client
        </button>
      </header>

      {error ? (
        <div className="border border-error bg-error-container px-6 py-4 text-body-sm font-body-sm text-on-error-container">
          {error}
        </div>
      ) : null}

      <div className="grid min-h-170 grid-cols-[360px_minmax(0,1fr)] border border-outline-variant bg-surface-container-lowest">
        <ClientList
          clients={clients}
          selectedClientId={selectedClient?.id ?? ''}
          onSelectClient={setSelectedClientId}
          onAddClient={() => setIsClientDrawerOpen(true)}
        />
        <ClientDetail
          client={selectedClient}
          onAddOrder={() => setIsOrderDrawerOpen(true)}
        />
      </div>

      <AddClientDrawer
        open={isClientDrawerOpen}
        onClose={() => setIsClientDrawerOpen(false)}
      />
      <AddOrderDrawer
        client={selectedClient}
        open={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
      />
    </section>
  )
}
