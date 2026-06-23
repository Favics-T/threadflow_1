'use client'

import { useState } from 'react'

type BriefPeriod = 'today' | 'this_week' | 'last_month'

type Step = {
  toolCalls?: { tool: string; input: unknown }[]
  toolResults?: { tool: string; result: unknown }[]
}

type AgentResponse = {
  response: string
  toolsCalled: string[]
  steps: Step[]
}

type BriefResponse = {
  brief: string
  date: string
  toolsCalled: string[]
}

const periodOptions: { value: BriefPeriod; label: string }[] = [
  { value: 'today',      label: "Today's Brief" },
  { value: 'this_week',  label: 'This Week'      },
  { value: 'last_month', label: 'Last Month'     },
]

export default function AgentUI() {
  const [input, setInput]                   = useState('')
  const [loading, setLoading]               = useState(false)
  const [response, setResponse]             = useState<AgentResponse | null>(null)
  const [brief, setBrief]                   = useState<BriefResponse | null>(null)
  const [briefLoading, setBriefLoading]     = useState(false)
  const [showPeriodPicker, setShowPeriodPicker] = useState(false)
  const [error, setError]                   = useState<string | null>(null)

  async function handleSubmit() {
    if (!input.trim() || loading) return
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setResponse(data)
      setInput('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  async function handleBrief(period: BriefPeriod) {
    setShowPeriodPicker(false)
    setBriefLoading(true)
    setBrief(null)
    setError(null)

    try {
      const res = await fetch(`/api/agent/morning-brief?period=${period}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setBrief(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setBriefLoading(false)
    }
  }

  return (
    <main className="px-10 py-10 pb-16 max-w-5xl">

      {/* Header */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Studio Intelligence
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">AI Agent</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            Ask anything about your studio. The agent checks real data and shows its reasoning.
          </p>
        </div>

        {/* Brief Me button */}
        <div className="relative">
          <button
            onClick={() => setShowPeriodPicker((v) => !v)}
            disabled={briefLoading}
            className="flex items-center gap-2 bg-primary text-on-primary px-8 py-3 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">
              {briefLoading ? 'progress_activity' : 'wb_sunny'}
            </span>
            {briefLoading ? 'GENERATING...' : 'BRIEF ME'}
          </button>

          {/* Period picker dropdown */}
          {showPeriodPicker && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest border border-outline-variant z-50">
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
      </header>

      {/* Morning Brief result */}
      {brief && (
        <section className="mb-10 border border-outline-variant bg-surface-container-lowest">
          <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface-container-low">
            <div>
              <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                Morning Brief
              </span>
              <h2 className="font-headline-md text-headline-md text-primary mt-0.5">{brief.date}</h2>
            </div>
            <div className="flex items-center gap-2">
              {brief.toolsCalled.map((t) => (
                <span
                  key={t}
                  className="text-label-caps font-label-caps px-2 py-1 bg-surface-container text-on-surface-variant"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="px-6 py-6">
            <p className="text-body-lg font-body-lg text-on-surface leading-relaxed whitespace-pre-wrap">
              {brief.brief}
            </p>
          </div>
        </section>
      )}

      {/* Command input */}
      <section className="mb-8">
        <div className="border border-outline-variant bg-surface-container-lowest">
          <div className="flex items-center">
            <div className="px-5 py-4 flex-1 flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0">
                magic_button
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSubmit()
                }}
                disabled={loading}
                placeholder='e.g. "When will Adaeze\s order be ready?" or "Who should I assign the new order to?"'
                className="w-full border-none outline-none bg-transparent text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/50 disabled:opacity-50"
              />
            </div>
            <div className="px-5 py-4 border-l border-outline-variant flex items-center gap-4 flex-shrink-0">
              <span className="text-label-caps font-label-caps text-on-surface-variant bg-surface-container px-2 py-1">
                ⌘ Enter
              </span>
              <button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="bg-primary text-on-primary p-2.5 hover:opacity-90 transition-opacity disabled:opacity-40"
                aria-label="Submit"
              >
                <span className="material-symbols-outlined">
                  {loading ? 'progress_activity' : 'arrow_forward'}
                </span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-6 py-4 border-t border-outline-variant bg-error-container/30 flex items-start gap-3">
              <span className="material-symbols-outlined text-sm text-on-error-container mt-0.5">error</span>
              <p className="text-body-sm font-body-sm text-on-error-container">{error}</p>
            </div>
          )}
        </div>
      </section>

      {/* Agent response */}
      {response && (
        <section className="flex flex-col gap-6">

          {/* Response text */}
          <div className="border border-outline-variant bg-surface-container-lowest">
            <div className="flex items-center gap-2 px-6 py-5 border-b border-outline-variant">
              <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
              <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                Agent Response
              </span>
            </div>
            <div className="px-6 py-6">
              <p className="text-body-lg font-body-lg text-on-surface leading-relaxed whitespace-pre-wrap">
                {response.response}
              </p>
            </div>
          </div>

          {/* Reasoning chain — the agentic demo moment */}
          {response.steps?.length > 0 && (
            <div className="border border-outline-variant bg-surface-container-lowest">
              <div className="px-6 py-5 border-b border-outline-variant">
                <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                  Reasoning Chain
                </span>
                <h2 className="font-headline-md text-headline-md text-primary mt-0.5">
                  How the agent reached this answer
                </h2>
              </div>

              <div className="px-6 py-5 flex flex-col gap-6">
                {response.steps.map((step, i) => (
                  <div key={i} className="relative pl-8">
                    {/* Timeline line */}
                    {i < response.steps.length - 1 && (
                      <div className="absolute left-3 top-6 bottom-0 w-px bg-outline-variant" />
                    )}
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-6 h-6 bg-primary flex items-center justify-center">
                      <span className="text-on-primary text-[10px] font-label-caps font-label-caps">
                        {i + 1}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {step.toolCalls?.map((call, j) => (
                        <div key={j} className="border border-outline-variant bg-surface-container-low p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-sm text-tertiary">
                              build
                            </span>
                            <span className="text-label-caps font-label-caps text-primary">
                              {call.tool.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          </div>
                          <pre className="text-data-mono font-data-mono text-on-surface-variant text-xs overflow-x-auto">
                            {JSON.stringify(call.input, null, 2)}
                          </pre>
                        </div>
                      ))}

                      {step.toolResults?.map((result, j) => (
                        <div key={j} className="border border-outline-variant bg-surface-container-lowest p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-sm text-on-surface-variant">
                              output
                            </span>
                            <span className="text-label-caps font-label-caps text-on-surface-variant">
                              {result.tool.replace(/_/g, ' ')} result
                            </span>
                          </div>
                          <pre className="text-data-mono font-data-mono text-on-surface-variant text-xs overflow-x-auto">
                            {JSON.stringify(result.result, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  )
}