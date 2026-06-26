'use client'

import { useEffect, useState } from 'react'

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

const PLACEHOLDER_HINTS = [
  "When will Adaeze's order be ready?",
  'Who should I assign the new agbada order to?',
  'Flag any fabric shortages',
  "What's blocking Chiamaka's order?",
]

const SUGGESTED_PROMPTS = [
  "When will Adaeze's order be ready?",
  'Flag all low fabric stock',
  'Who has the lightest workload today?',
]

const FEATURE_CARDS = [
  {
    icon: 'magic_button',
    title: 'Delivery Estimates',
    description:
      'Ask when any order will be ready — agent checks tailor load, fabric stock, and garment complexity.',
  },
  {
    icon: 'inventory_2',
    title: 'Fabric Intelligence',
    description: 'Flag low stock, check availability, and block orders missing materials.',
  },
  {
    icon: 'person_search',
    title: 'Tailor Assignment',
    description: 'Get AI-suggested tailor assignments with full workload reasoning.',
  },
  {
    icon: 'wb_sunny',
    title: 'Morning Brief',
    description: 'One click to surface every urgent decision for the day.',
  },
]

const STUDIO_HEALTH = [
  { label: 'Active Orders', value: 8, className: 'bg-success/10 text-success', dotClassName: 'bg-success' },
  { label: 'Needs Attention', value: 3, className: 'bg-warning/10 text-warning', dotClassName: 'bg-warning' },
  { label: 'Blocked', value: 1, className: 'bg-urgent/10 text-urgent', dotClassName: 'bg-urgent' },
]

function renderWithBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-primary">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

function renderBriefBody(text: string) {
  return text.split('\n').map((rawLine, i) => {
    const line = rawLine.trim()
    if (!line) return null

    if (/^URGENT:/i.test(line)) {
      return (
        <div key={i} className="border-l-4 border-l-urgent bg-urgent/5 px-4 py-3">
          <p className="text-body-sm font-body-sm text-on-surface leading-relaxed">
            <strong className="text-urgent">URGENT:</strong>
            {line.replace(/^URGENT:/i, '')}
          </p>
        </div>
      )
    }

    if (/^RECOMMENDED ACTIONS:/i.test(line)) {
      return (
        <div key={i} className="border-l-4 border-l-tertiary bg-tertiary-fixed/30 px-4 py-3">
          <p className="text-body-sm font-body-sm text-on-surface leading-relaxed">
            <strong className="text-tertiary">RECOMMENDED ACTIONS:</strong>
            {line.replace(/^RECOMMENDED ACTIONS:/i, '')}
          </p>
        </div>
      )
    }

    const numbered = line.match(/^(\d+)\.\s*(.*)/)
    if (numbered) {
      return (
        <div key={i} className="flex items-start gap-3">
          <span className="text-body-sm font-body-sm font-semibold text-primary shrink-0">{numbered[1]}.</span>
          <p className="text-body-sm font-body-sm text-on-surface leading-relaxed">{numbered[2]}</p>
        </div>
      )
    }

    return (
      <p key={i} className="text-body-lg font-body-lg text-on-surface leading-relaxed">
        {line}
      </p>
    )
  })
}

export default function AgentPage() {
  const [input, setInput]                       = useState('')
  const [loading, setLoading]                   = useState(false)
  const [response, setResponse]                 = useState<AgentResponse | null>(null)
  const [brief, setBrief]                       = useState<BriefResponse | null>(null)
  const [briefLoading, setBriefLoading]         = useState(false)
  const [showPeriodPicker, setShowPeriodPicker] = useState(false)
  const [error, setError]                       = useState<string | null>(null)

  const [hintIndex, setHintIndex] = useState(0)
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set())

  useEffect(() => {
    const id = setInterval(() => {
      setHintIndex((i) => (i + 1) % PLACEHOLDER_HINTS.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  function toggleExpanded(key: string) {
    setExpandedResults((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

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

  const hasSteps = (response?.steps?.length ?? 0) > 0

  return (
    <main className="px-10 py-10 pb-16">
      {/* ── Section 1: Page header ───────────────────────────────────────── */}
      <header className="flex justify-between items-end mb-10 flex-wrap gap-4">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Studio Intelligence
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">AI Agent</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            Ask anything about your studio. The agent checks live data and shows every step of its reasoning.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowPeriodPicker((v) => !v)}
            disabled={briefLoading}
            className="flex items-center gap-2 bg-primary text-on-primary px-8 py-3 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-lg ${briefLoading ? 'animate-spin' : ''}`}>
              {briefLoading ? 'progress_activity' : 'wb_sunny'}
            </span>
            {briefLoading ? 'GENERATING…' : 'BRIEF ME'}
          </button>

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

      {/* ── Section 3: Brief Me result ───────────────────────────────────── */}
      {brief && (
        <section className="mb-10 border border-outline-variant bg-surface-container-lowest">
          <div className="flex items-center justify-between gap-4 flex-wrap px-6 py-5 border-b border-outline-variant bg-surface-container-low">
            <div>
              <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                Morning Brief
              </span>
              <h2 className="font-headline-md text-headline-md text-primary mt-0.5">{brief.date}</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {brief.toolsCalled.map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="text-label-caps font-label-caps px-2 py-1 bg-surface-container text-on-surface-variant"
                >
                  {t.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          <div className="px-6 py-6 flex flex-col gap-5">
            {/* Studio health indicator row */}
            <div className="flex items-center gap-3 flex-wrap">
              {STUDIO_HEALTH.map((stat) => (
                <span
                  key={stat.label}
                  className={`flex items-center gap-2 px-3 py-1.5 text-label-caps font-label-caps ${stat.className}`}
                >
                  <span className={`w-2 h-2 shrink-0 ${stat.dotClassName}`} />
                  {stat.value} {stat.label}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3">{renderBriefBody(brief.brief)}</div>
          </div>
        </section>
      )}

      {/* ── Section 2: Command input ─────────────────────────────────────── */}
      <section className="mb-6">
        <div className="border border-outline-variant bg-surface-container-lowest transition-colors focus-within:border-primary">
          <div className="flex items-center">
            <div className="px-5 py-4 flex-1 flex items-center gap-4 min-w-0">
              <span
                className={`material-symbols-outlined flex-shrink-0 ${
                  loading ? 'text-primary animate-spin' : 'text-primary'
                }`}
              >
                {loading ? 'progress_activity' : 'magic_button'}
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSubmit()
                }}
                disabled={loading}
                placeholder={PLACEHOLDER_HINTS[hintIndex]}
                className="w-full min-w-0 border-none outline-none bg-transparent text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/60 disabled:opacity-50"
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
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          {loading && (
            <div className="px-6 py-3 border-t border-outline-variant">
              <p className="text-label-caps font-label-caps text-on-surface-variant">Agent is thinking…</p>
            </div>
          )}

          {error && (
            <div className="px-6 py-4 border-t border-outline-variant bg-urgent/5 flex items-start gap-3">
              <span className="material-symbols-outlined text-sm text-urgent mt-0.5">error</span>
              <p className="text-body-sm font-body-sm text-urgent">{error}</p>
            </div>
          )}
        </div>

        {/* Suggested prompt chips */}
        <div className="flex items-center gap-2 flex-wrap mt-4">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setInput(prompt)}
              className="border border-outline-variant rounded-full px-4 py-1.5 text-label-caps text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      {/* ── Section 4: Agent response — two column layout ────────────────── */}
      {response && (
        <section className={`grid gap-6 mb-10 ${hasSteps ? 'grid-cols-1 lg:grid-cols-5' : 'grid-cols-1'}`}>
          {/* Left column — The Answer */}
          <div className={`border border-outline-variant bg-surface-container-lowest ${hasSteps ? 'lg:col-span-3' : ''}`}>
            <div className="flex items-center gap-2 px-6 py-5 border-b border-outline-variant">
              <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
              <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                Agent Response
              </span>
            </div>
            <div className="px-6 py-6">
              <p className="text-body-lg font-body-lg text-on-surface leading-relaxed whitespace-pre-wrap">
                {renderWithBold(response.response)}
              </p>
            </div>

            {response.toolsCalled.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap px-6 py-4 border-t border-outline-variant">
                <span className="text-label-caps font-label-caps text-on-surface-variant">Checked:</span>
                {response.toolsCalled.map((tool, i) => (
                  <span
                    key={`${tool}-${i}`}
                    className="flex items-center gap-1.5 rounded-full bg-surface-container text-on-surface-variant text-label-caps font-label-caps px-3 py-1"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                      magic_button
                    </span>
                    {tool.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right column — Reasoning Chain */}
          {hasSteps && (
            <div className="border border-outline-variant bg-surface-container-lowest lg:col-span-2">
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
                    {i < response.steps.length - 1 && (
                      <div className="absolute left-3 top-6 bottom-0 w-px bg-outline-variant" />
                    )}
                    <div className="absolute left-0 top-1.5 w-6 h-6 bg-primary flex items-center justify-center">
                      <span className="text-on-primary text-[10px] font-label-caps font-label-caps">{i + 1}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {step.toolCalls?.map((call, j) => (
                        <div key={j} className="border border-outline-variant bg-surface-container-low p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-sm text-tertiary">build</span>
                            <span className="text-label-caps font-label-caps text-primary">
                              {call.tool.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          </div>
                          <pre className="text-data-mono font-data-mono text-on-surface-variant text-xs overflow-x-auto">
                            {JSON.stringify(call.input, null, 2)}
                          </pre>
                        </div>
                      ))}

                      {step.toolResults?.map((result, j) => {
                        const key = `${i}-${j}`
                        const json = JSON.stringify(result.result, null, 2)
                        const isLong = json.length > 300
                        const isExpanded = expandedResults.has(key)
                        const displayJson = isLong && !isExpanded ? `${json.slice(0, 300)}…` : json

                        return (
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
                              {displayJson}
                            </pre>
                            {isLong && (
                              <button
                                onClick={() => toggleExpanded(key)}
                                className="text-label-caps font-label-caps text-primary hover:underline mt-2"
                              >
                                {isExpanded ? 'SHOW LESS' : 'SHOW MORE'}
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Empty / idle state ────────────────────────────────────────────── */}
      {!brief && !response && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURE_CARDS.map((card) => (
            <div key={card.title} className="border border-outline-variant bg-surface-container-lowest p-6">
              <span className="material-symbols-outlined text-primary text-2xl mb-3 block">{card.icon}</span>
              <h3 className="font-headline-md text-headline-md text-primary mb-1">{card.title}</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">{card.description}</p>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
