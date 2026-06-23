import type { StudioClient } from '@/app/clients/types'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

type ClientListProps = {
  clients: StudioClient[]
  selectedClientId: string
  onSelectClient: (clientId: string) => void
  onAddClient: () => void
}

export function ClientList({
  clients,
  selectedClientId,
  onSelectClient,
  onAddClient,
}: ClientListProps) {
  return (
    <aside className="border-r border-outline-variant bg-surface-container-low">
      <div className="flex items-center justify-between border-b border-outline-variant px-6 py-6">
        <div>
          <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
            Directory
          </span>
          <h2 className="mt-0.5 font-headline-md text-headline-md text-primary">
            Studio Clients
          </h2>
        </div>
        <button
          type="button"
          onClick={onAddClient}
          aria-label="Add client"
          className="flex h-10 w-10 items-center justify-center bg-primary text-on-primary transition-opacity hover:opacity-90"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="flex h-[520px] flex-col items-center justify-center px-8 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">
            group
          </span>
          <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant">
            No clients in the studio directory yet.
          </p>
        </div>
      ) : (
        <div className="hide-scrollbar max-h-[680px] overflow-y-auto divide-y divide-outline-variant/30">
          {clients.map((client) => {
            const selected = client.id === selectedClientId

            return (
              <button
                key={client.id}
                type="button"
                onClick={() => onSelectClient(client.id)}
                className={`grid w-full grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 text-left transition-colors ${
                  selected
                    ? 'border-l-2 border-primary bg-surface-container-high'
                    : 'border-l-2 border-transparent hover:bg-surface-container-high'
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center bg-surface-container-lowest text-label-caps font-label-caps text-primary">
                  {initials(client.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-body-sm font-body-sm font-semibold text-primary">
                    {client.name}
                  </span>
                  <span className="block truncate text-body-sm font-body-sm text-on-surface-variant">
                    {client.phone ?? 'No phone recorded'}
                  </span>
                </span>
                <span className="bg-surface-container-lowest px-2 py-1 text-data-mono font-data-mono text-on-surface-variant">
                  {client.orders.length}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </aside>
  )
}
