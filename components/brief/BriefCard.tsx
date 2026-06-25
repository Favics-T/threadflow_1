import type { BriefSnapshot } from '@/lib/brief'

type Status = 'idle' | 'loading' | 'streaming' | 'done' | 'error'

export function BriefCard({
  snapshot,
  briefText,
  status,
  onRegenerate,
}: {
  snapshot: BriefSnapshot
  briefText: string
  status: Status
  onRegenerate: () => void
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center gap-3 px-8 py-7 border-b border-outline-variant bg-surface-container-low">
        <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-primary">checkroom</span>
        </div>
        <div>
          <p className="text-label-caps font-label-caps text-on-surface-variant">ThreadFlow AI</p>
          <h2 className="font-headline-md text-headline-md text-primary">Monday Morning Brief</h2>
        </div>
      </div>

      <div className="px-8 py-7 flex flex-col gap-6">
        {snapshot.atRiskOrders.length > 0 && (
          <div className="border border-urgent/40 bg-urgent/10">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-urgent/30">
              <span className="material-symbols-outlined text-urgent">warning</span>
              <p className="text-label-caps font-label-caps text-urgent uppercase tracking-widest">
                Urgent Attention Needed
              </p>
            </div>
            <div className="flex flex-col divide-y divide-urgent/20">
              {snapshot.atRiskOrders.map((o, i) => (
                <div key={i} className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap">
                  <div>
                    <p className="text-body-sm font-body-sm font-semibold text-urgent">{o.clientName}</p>
                    <p className="text-label-caps font-label-caps text-urgent/80">{o.clothType}</p>
                  </div>
                  <span className="text-label-caps font-label-caps px-2 py-0.5 bg-urgent text-white whitespace-nowrap">
                    {o.daysLeft <= 0 ? 'OVERDUE' : `${o.daysLeft} DAY${o.daysLeft === 1 ? '' : 'S'} LEFT`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-3">
            Today&rsquo;s Briefing
          </p>

          {status === 'loading' && (
            <div className="flex items-center gap-2 py-6 justify-center">
              <span className="material-symbols-outlined text-on-surface-variant animate-spin">progress_activity</span>
              <span className="text-body-sm font-body-sm text-on-surface-variant">Preparing your brief…</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-start gap-2 bg-urgent/10 p-3">
              <span className="material-symbols-outlined text-sm text-urgent mt-0.5">error</span>
              <p className="text-body-sm font-body-sm text-urgent">
                Something went wrong generating the brief. Try again.
              </p>
            </div>
          )}

          {(status === 'streaming' || status === 'done') && (
            <p className="text-body-lg font-body-lg text-on-surface leading-relaxed whitespace-pre-line">
              {briefText}
              {status === 'streaming' && (
                <span className="inline-block w-1.5 h-4 bg-primary ml-1 align-middle animate-pulse" />
              )}
            </p>
          )}
        </div>
      </div>

      <div className="px-8 py-6 border-t border-outline-variant bg-surface-container-low/40">
        <button
          onClick={onRegenerate}
          disabled={status === 'loading' || status === 'streaming'}
          className="flex items-center gap-2 border border-outline-variant text-on-surface-variant px-5 py-2.5 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-primary transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          REGENERATE BRIEF
        </button>
      </div>
    </div>
  )
}
