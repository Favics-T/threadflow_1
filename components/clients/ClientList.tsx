import type { StudioClient } from '@/app/clients/types'

type Props = {
  clients: StudioClient[]
  selectedClientId: string
  onSelectClient: (id: string) => void
  onAddClient: () => void
}

export function ClientList({ clients, selectedClientId, onSelectClient }: Props) {
  return (
    <aside className="border-r border-outline-variant flex flex-col h-full">
      <div className="px-6 py-5 border-b border-outline-variant">
        <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-0.5">
          Directory
        </p>
        <h2 className="font-headline-md text-headline-md text-primary">
          {clients.length} Clients
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/30">
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-16 text-center px-6">
            <span className="material-symbols-outlined text-4xl text-outline-variant">person_off</span>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              No clients yet. Add your first client to get started.
            </p>
          </div>
        ) : (
          clients.map((client) => {
            const isSelected = client.id === selectedClientId
            const initials = client.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()

            return (
              <button
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className={`w-full text-left flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
                  isSelected
                    ? 'bg-surface-container-high border-r-2 border-primary'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                <div className="w-9 h-9 bg-surface-container flex items-center justify-center flex-shrink-0">
                  <span className="text-label-caps font-label-caps text-primary">{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-body-sm font-semibold text-primary truncate">
                    {client.name}
                  </p>
                  <p className="text-label-caps font-label-caps text-on-surface-variant mt-0.5">
                    {client.phone ?? 'No phone'}
                  </p>
                </div>
                <span className="text-label-caps font-label-caps text-on-surface-variant bg-surface-container px-2 py-0.5 flex-shrink-0">
                  {client.orders.length}
                </span>
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}