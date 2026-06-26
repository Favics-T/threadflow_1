'use client'

import { useState } from 'react'

type BriefPeriod = 'today' | 'this_week' | 'last_month'

type BriefResponse = {
  brief: string
  date: string
  toolsCalled: string[]
}

const periodOptions: { value: BriefPeriod; label: string }[] = [
  { value: 'today',      label: "Today's Brief"  },
  { value: 'this_week',  label: 'This Week'       },
  { value: 'last_month', label: 'Last Month'      },
]

export function MorningBriefWidget() {
  const [brief, setBrief]                       = useState<BriefResponse | null>(null)
  const [loading, setLoading]                   = useState(false)
  const [error, setError]                       = useState<string | null>(null)
  const [showPicker, setShowPicker]             = useState(false)
  const [activePeriod, setActivePeriod]         = useState<BriefPeriod | null>(null)

  async function handleBrief(period: BriefPeriod) {
    setShowPicker(false)
    setActivePeriod(period)
    setLoading(true)
    setError(null)
    setBrief(null)

    try {
      const res = await fetch(`/api/agent/morning-brief?period=${period}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setBrief(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate brief')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-64 bg-surface-container-lowest mb-10">

      {/* Header row */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface-container-low">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            AI Operations
          </span>
          <h2 className="font-headline-md text-headline-md text-primary mt-0.5">
            Morning Brief
          </h2>
        </div>

        {/* Brief Me button with period picker */}
        <div className="relative">
          <button
            onClick={() => setShowPicker((v) => !v)}
            disabled={loading}
            className="flex items-center rounded gap-2 bg-primary text-on-primary px-2 py-2.5 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">
              {loading ? 'progress_activity' : 'wb_sunny'}
            </span>
            {loading ? 'GENERATING...' : 'BRIEF ME'}
          </button>

          {showPicker && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-surface-container-lowest border border-outline-variant z-50 shadow-lg">
              {periodOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleBrief(opt.value)}
                  className="w-full text-left px-5 py-3 text-label-caps font-label-caps text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors border-b border-outline-variant last:border-none"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!brief && !loading && !error && (
        <div className="flex items-center gap-4 px-6 py-5">
        
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Click <strong>Brief Me</strong> to get a prioritized AI summary of your studio, fabric alerts, tailor load, and decisions you need to make today.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-4 px-6 py-5">
          <span className="material-symbols-outlined text-on-surface-variant animate-spin">
            progress_activity
          </span>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Agent is checking fabric stock, tailor workloads, and active orders…
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-6 py-5 bg-error-container/30">
          <span className="material-symbols-outlined text-sm text-on-error-container">error</span>
          <p className="text-body-sm font-body-sm text-on-error-container">{error}</p>
        </div>
      )}

      {/* Brief result */}
      {brief && (
        <div className="px-6 py-6">
          {/* Tools called badges */}
          {brief.toolsCalled.length > 0 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="material-symbols-outlined text-sm text-tertiary">magic_button</span>
              <span className="text-label-caps font-label-caps text-on-surface-variant">
                Checked:
              </span>
              {brief.toolsCalled.map((t) => (
                <span
                  key={t}
                  className="text-label-caps font-label-caps px-2 py-0.5 bg-surface-container text-on-surface-variant"
                >
                  {t.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}

          {/* Brief text */}
          <p className="text-body-lg font-body-lg text-on-surface leading-relaxed whitespace-pre-wrap">
            {brief.brief}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline-variant">
            <p className="text-label-caps font-label-caps text-on-surface-variant">
              {brief.date} · {activePeriod === 'today' ? "Today's brief" : activePeriod === 'this_week' ? 'Weekly summary' : 'Monthly overview'}
            </p>
            <a
              href="/agent"
              className="flex items-center gap-1 text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors"
            >
              OPEN AGENT
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}