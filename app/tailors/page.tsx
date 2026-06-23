import { createServerClient } from '@/lib/supabase/server'

export default async function TailorsPage() {
  const supabase = createServerClient()
  const { data: tailors } = await supabase
    .from('tailors')
    .select('id, name, current_load_hours')
    .order('current_load_hours', { ascending: true })

  const all = tailors ?? []

  function loadStatus(hours: number) {
    if (hours <= 8)  return { label: 'AVAILABLE',   dot: 'bg-[#10B981]', bar: 'bg-[#10B981]' }
    if (hours <= 15) return { label: 'MODERATE',    dot: 'bg-amber-400',  bar: 'bg-amber-400'  }
    return               { label: 'HIGH LOAD',   dot: 'bg-red-500',    bar: 'bg-red-500'    }
  }

  return (
    <main className="px-10 py-10 pb-16">
      <header className="flex justify-between items-end mb-12">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Studio Floor
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Tailors</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            Live workload overview. The AI agent reads this data when calculating delivery estimates and assigning new orders.
          </p>
        </div>
      </header>

      <section>
        <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-6">
          Workforce Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {all.map((tailor) => {
            const status = loadStatus(tailor.current_load_hours ?? 0)
            const pct = Math.min(((tailor.current_load_hours ?? 0) / 20) * 100, 100)

            return (
              <div
                key={tailor.id}
                className="border border-outline-variant bg-surface-container-lowest p-8 flex flex-col gap-6 hover:border-primary transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-surface-container flex items-center justify-center">
                        <span className="font-headline-md text-headline-md text-primary">
                          {tailor.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${status.dot}`} />
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-primary">{tailor.name}</h3>
                      <p className="text-label-caps font-label-caps text-on-surface-variant mt-1">Tailor</p>
                    </div>
                  </div>
                  <span className={`text-label-caps font-label-caps px-3 py-1 ${
                    status.label === 'AVAILABLE' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                    status.label === 'MODERATE'  ? 'bg-amber-50 text-amber-800' :
                    'bg-error-container text-on-error-container'
                  }`}>
                    {status.label}
                  </span>
                </div>

                {/* Workload bar */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-body-sm font-body-sm text-on-surface-variant">Active Load</p>
                    <p className="text-data-mono font-data-mono text-primary font-bold">
                      {tailor.current_load_hours}h / 20h
                    </p>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${status.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* AI note */}
                <div className="mt-auto pt-6 border-t border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">magic_button</span>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    {status.label === 'AVAILABLE'
                      ? 'AI will prioritise for new assignments'
                      : status.label === 'MODERATE'
                      ? 'AI will assign with caution'
                      : 'AI will avoid assigning new orders'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}