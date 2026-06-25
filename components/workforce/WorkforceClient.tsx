'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ProductionOrder, TailorAssignment } from '@/lib/types/conversations'

type Tailor = {
  id: string
  name: string
  current_load_hours: number
}

type Props = {
  tailors: Tailor[]
  pendingAssignment: ProductionOrder[]
  pastAssignments: TailorAssignment[]
}

function loadStatus(hours: number) {
  if (hours <= 8)  return { label: 'AVAILABLE',  dot: 'bg-[#10B981]', bar: 'bg-[#10B981]', badge: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' }
  if (hours <= 15) return { label: 'MODERATE',   dot: 'bg-amber-400',  bar: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-800' }
  return               { label: 'HIGH LOAD',  dot: 'bg-red-500',    bar: 'bg-red-500',    badge: 'bg-error-container text-on-error-container' }
}

// Suggest the tailor with lowest load
function suggestTailor(tailors: Tailor[]): Tailor | null {
  const available = tailors.filter((t) => (t.current_load_hours ?? 0) <= 15)
  if (!available.length) return null
  return available.reduce((a, b) =>
    (a.current_load_hours ?? 0) < (b.current_load_hours ?? 0) ? a : b
  )
}

export function WorkforceClient({ tailors, pendingAssignment, pastAssignments }: Props) {
  const [assignments, setAssignments] = useState<
    Record<string, { tailorId: string; tailorName: string; approved: boolean; pending: boolean }>
  >({})
  const [historyFilter, setHistoryFilter] = useState<'this_month' | 'last_month' | 'all'>('this_month')

  function handleSuggest(orderId: string) {
    const suggestion = suggestTailor(tailors)
    if (!suggestion) return
    setAssignments((prev) => ({
      ...prev,
      [orderId]: {
        tailorId: suggestion.id,
        tailorName: suggestion.name,
        approved: false,
        pending: false,
      },
    }))
  }

  function handleApprove(orderId: string) {
    setAssignments((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], pending: true },
    }))
    setTimeout(() => {
      setAssignments((prev) => ({
        ...prev,
        [orderId]: { ...prev[orderId], approved: true, pending: false },
      }))
    }, 800)
  }

  function handleChangeTailor(orderId: string, tailorId: string) {
    const tailor = tailors.find((t) => t.id === tailorId)
    if (!tailor) return
    setAssignments((prev) => ({
      ...prev,
      [orderId]: { tailorId, tailorName: tailor.name, approved: false, pending: false },
    }))
  }

  // Count completed jobs per tailor for history view
  const completedByTailor = pastAssignments.reduce<Record<string, number>>((acc, a) => {
    acc[a.tailorName] = (acc[a.tailorName] ?? 0) + 1
    return acc
  }, {})

  return (
    <main className="px-10 py-10 pb-16">
      {/* Header */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Studio Floor
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Workforce</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            Live tailor workload, AI-suggested assignments, and production history.
          </p>
        </div>
      </header>

      {/* ── Tailor Workload ───────────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-6">
          Workforce Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tailors.map((tailor) => {
            const status = loadStatus(tailor.current_load_hours ?? 0)
            const pct = Math.min(((tailor.current_load_hours ?? 0) / 20) * 100, 100)
            const completedCount = completedByTailor[tailor.name] ?? 0

            return (
              <div
                key={tailor.id}
                className="border border-outline-variant bg-surface-container-lowest p-8 flex flex-col gap-6 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-surface-container flex items-center justify-center">
                        <span className="font-headline-md text-headline-md text-primary">
                          {tailor.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${status.dot}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-primary">
                        {tailor.name}
                      </h3>
                      <p className="text-label-caps font-label-caps text-on-surface-variant mt-1">
                        {completedCount} jobs completed
                      </p>
                    </div>
                  </div>
                  <span className={`text-label-caps font-label-caps px-3 py-1 ${status.badge}`}>
                    {status.label}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-body-sm font-body-sm text-on-surface-variant">
                      Active Load
                    </p>
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

                <div className="mt-auto pt-6 border-t border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">
                    magic_button
                  </span>
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

      {/* ── Pending Assignments ───────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
              Pending Assignment
            </h2>
            <span className="bg-surface-container text-on-surface-variant text-label-caps font-label-caps px-2 py-0.5 rounded-full">
              {pendingAssignment.length}
            </span>
          </div>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Confirmed orders waiting for a tailor. AI suggests the best available — approve to assign.
          </p>
        </div>

        {pendingAssignment.length === 0 ? (
          <div className="border border-outline-variant bg-surface-container-lowest px-6 py-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">check_circle</span>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              All confirmed orders have been assigned.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pendingAssignment.map((order) => {
              const asgn = assignments[order.id]

              return (
                <div
                  key={order.id}
                  className="border border-outline-variant bg-surface-container-lowest"
                >
                  <div className="px-6 py-5 border-b border-outline-variant">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-body-sm font-body-sm font-semibold text-primary mb-1">
                          {order.clientName}
                        </p>
                        <p className="text-body-sm font-body-sm text-on-surface">
                          {order.garmentDescription}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span
                            className="material-symbols-outlined text-on-surface-variant"
                            style={{ fontSize: '14px' }}
                          >
                            calendar_today
                          </span>
                          <span className="text-label-caps font-label-caps text-on-surface-variant">
                            Due {order.agreedDeliveryDate}
                          </span>
                        </div>
                      </div>
                      <span className="text-label-caps font-label-caps px-2 py-0.5 bg-surface-container text-on-surface-variant shrink-0">
                        NEEDS TAILOR
                      </span>
                    </div>
                  </div>

                  {/* Assignment UI */}
                  <div className="px-6 py-5">
                    {!asgn ? (
                      <button
                        onClick={() => handleSuggest(order.id)}
                        className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-sm">magic_button</span>
                        AI SUGGEST TAILOR
                      </button>
                    ) : asgn.approved ? (
                      <div className="flex items-center gap-2 bg-tertiary-fixed/40 px-4 py-3">
                        <span className="material-symbols-outlined text-sm text-tertiary">
                          check_circle
                        </span>
                        <span className="text-label-caps font-label-caps text-on-surface-variant">
                          Assigned to {asgn.tailorName}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {/* AI suggestion banner */}
                        <div className="flex items-center gap-3 border border-outline-variant bg-surface-container-low px-4 py-3">
                          <span className="material-symbols-outlined text-sm text-tertiary">
                            magic_button
                          </span>
                          <div className="flex-1">
                            <p className="text-label-caps font-label-caps text-on-surface-variant mb-0.5">
                              AI Suggestion
                            </p>
                            <p className="text-body-sm font-body-sm text-primary font-semibold">
                              {asgn.tailorName}
                            </p>
                            <p className="text-label-caps font-label-caps text-on-surface-variant">
                              Lowest current load — best availability
                            </p>
                          </div>
                        </div>

                        {/* Manual override select */}
                        <div className="flex items-center gap-3">
                          <select
                            value={asgn.tailorId}
                            onChange={(e) => handleChangeTailor(order.id, e.target.value)}
                            className="flex-1 border border-outline-variant bg-surface-container-lowest text-on-surface text-body-sm font-body-sm px-3 py-2 focus:outline-none focus:border-primary"
                          >
                            {tailors.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} — {t.current_load_hours}h load
                              </option>
                            ))}
                          </select>

                          {asgn.pending ? (
                            <div className="flex items-center gap-2 px-4 py-2">
                              <span className="material-symbols-outlined text-sm text-on-surface-variant animate-spin">
                                progress_activity
                              </span>
                              <span className="text-label-caps font-label-caps text-on-surface-variant">
                                Approving…
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleApprove(order.id)}
                              className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity shrink-0"
                            >
                              <span className="material-symbols-outlined text-sm">
                                how_to_reg
                              </span>
                              APPROVE
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Assignment History ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
              Assignment History
            </h2>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Completed jobs and tailor output over time.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2">
            {(
              [
                { key: 'this_month', label: 'This Month' },
                { key: 'last_month', label: 'Last Month' },
                { key: 'all',        label: 'All Time' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setHistoryFilter(opt.key)}
                className={`px-3 py-1 text-label-caps font-label-caps transition-colors ${
                  historyFilter === opt.key
                    ? 'bg-primary text-on-primary'
                    : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tailor output summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {tailors.map((tailor) => {
            const count = pastAssignments.filter((a) => a.tailorName === tailor.name).length
            const aiCount = pastAssignments.filter(
              (a) => a.tailorName === tailor.name && a.suggestedByAI
            ).length

            return (
              <div
                key={tailor.id}
                className="border border-outline-variant bg-surface-container-lowest px-6 py-5"
              >
                <p className="text-body-sm font-body-sm font-semibold text-primary mb-1">
                  {tailor.name}
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-data-mono font-data-mono text-primary text-2xl font-bold">
                      {count}
                    </p>
                    <p className="text-label-caps font-label-caps text-on-surface-variant">
                      jobs completed
                    </p>
                  </div>
                  <div>
                    <p className="text-data-mono font-data-mono text-tertiary text-2xl font-bold">
                      {aiCount}
                    </p>
                    <p className="text-label-caps font-label-caps text-on-surface-variant">
                      AI-assigned
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Assignment log table */}
        <div className="border border-outline-variant bg-surface-container-lowest">
          <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-outline-variant bg-surface-container">
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
              Tailor
            </p>
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest col-span-2">
              Order
            </p>
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
              Assigned
            </p>
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
              Completed
            </p>
          </div>

          {pastAssignments.map((asgn, i) => (
            <div
              key={asgn.id}
              className={`grid grid-cols-5 gap-4 px-6 py-4 items-center ${
                i < pastAssignments.length - 1 ? 'border-b border-outline-variant' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <p className="text-body-sm font-body-sm text-primary font-semibold">
                  {asgn.tailorName}
                </p>
                {asgn.suggestedByAI && (
                  <span className="material-symbols-outlined text-tertiary" style={{ fontSize: '14px' }}>
                    magic_button
                  </span>
                )}
              </div>
              <div className="col-span-2">
                <p className="text-body-sm font-body-sm text-on-surface">{asgn.clientName}</p>
                <p className="text-label-caps font-label-caps text-on-surface-variant">
                  {asgn.garmentDescription}
                </p>
              </div>
              <p className="text-label-caps font-label-caps text-on-surface-variant">
                {asgn.assignedAt}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-tertiary"
                  style={{ fontSize: '14px', fontVariationSettings: '"FILL" 1' }}
                >
                  check_circle
                </span>
                <p className="text-label-caps font-label-caps text-on-surface-variant">
                  {asgn.completedAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}