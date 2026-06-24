'use client'

import { useState } from 'react'

type DraftState =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'error'; message: string }
  | {
      phase: 'staged'
      client: { name: string; phone: string }
      draft_message: string
      delivery_estimate: string
      estimate_status: string
      order_status: string
      reasoning: string[]
    }
  | { phase: 'approved'; clientName: string }
  | { phase: 'discarded' }

export function ApprovalGate() {
  const [state, setState] = useState<DraftState>({ phase: 'idle' })

  async function handleDraft() {
    setState({ phase: 'loading' })
    try {
      const res = await fetch('/api/agent/draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName: 'Adaeze' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Agent error')
      setState({
        phase: 'staged',
        client: data.client,
        draft_message: data.draft_message,
        delivery_estimate: data.delivery_estimate,
        estimate_status: data.estimate_status,
        order_status: data.order_status,
        reasoning: data.reasoning ?? [],
      })
    } catch (err) {
      setState({
        phase: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong',
      })
    }
  }

  if (state.phase === 'approved') {
    return (
      <div className="border border-outline-variant bg-surface-container-lowest p-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">check_circle</span>
          <p className="text-body-sm font-body-sm text-on-surface">
            Reply sent to {state.clientName}.
          </p>
        </div>
      </div>
    )
  }

  if (state.phase === 'discarded') {
    return (
      <div className="border border-outline-variant bg-surface-container-lowest p-6">
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Reply discarded. No message was sent.
        </p>
      </div>
    )
  }

  if (state.phase === 'idle') {
    return (
      <div className="border border-outline-variant bg-surface-container-lowest">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">
              Pending Approval
            </p>
            <h2 className="font-headline-md text-headline-md text-primary">
              Draft Reply
            </h2>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">mark_chat_unread</span>
        </div>
        <div className="px-6 py-5">
          <p className="text-body-sm font-body-sm text-on-surface-variant mb-4">
            The AI can draft a WhatsApp-style reply for Adaeze based on her live order status, fabric availability, and tailor workload.
          </p>
          <button
            onClick={handleDraft}
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">magic_button</span>
            DRAFT WITH AI
          </button>
        </div>
      </div>
    )
  }

  if (state.phase === 'loading') {
    return (
      <div className="border border-outline-variant bg-surface-container-lowest">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">
              Pending Approval
            </p>
            <h2 className="font-headline-md text-headline-md text-primary">Draft Reply</h2>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">mark_chat_unread</span>
        </div>
        <div className="flex items-center gap-3 px-6 py-5">
          <span className="material-symbols-outlined text-on-surface-variant animate-spin text-sm">
            progress_activity
          </span>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Agent is checking order, fabric, and tailor load…
          </p>
        </div>
      </div>
    )
  }

  if (state.phase === 'error') {
    return (
      <div className="border border-outline-variant bg-surface-container-lowest">
        <div className="px-6 py-5 border-b border-outline-variant">
          <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">Pending Approval</p>
          <h2 className="font-headline-md text-headline-md text-primary">Draft Reply</h2>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-start gap-2 mb-4 bg-error-container/30 p-3">
            <span className="material-symbols-outlined text-sm text-on-error-container mt-0.5">error</span>
            <p className="text-body-sm font-body-sm text-on-error-container">{state.message}</p>
          </div>
          <button
            onClick={handleDraft}
            className="w-full py-2.5 border border-outline-variant text-on-surface-variant text-label-caps font-label-caps hover:bg-surface-container transition-colors"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    )
  }

  // phase === 'staged'
  return (
    <div className="border border-outline-variant bg-surface-container-lowest">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
        <div>
          <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">
            Pending Approval
          </p>
          <h2 className="font-headline-md text-headline-md text-primary">
            Draft Reply
          </h2>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">mark_chat_unread</span>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {/* AI source label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-sm text-tertiary">magic_button</span>
          <span className="text-label-caps font-label-caps text-on-surface-variant">
            AI drafted · for {state.client.name}
          </span>
          <span className={`ml-auto text-label-caps font-label-caps px-2 py-0.5 ${
            state.estimate_status === 'on_track'
              ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
              : state.estimate_status === 'at_risk'
              ? 'bg-amber-50 text-amber-800'
              : 'bg-error-container text-on-error-container'
          }`}>
            {state.estimate_status === 'on_track' ? 'ON TRACK' : state.estimate_status === 'at_risk' ? 'AT RISK' : 'BLOCKED'}
          </span>
        </div>

        {/* Draft message */}
        <div className="bg-surface-container-low border border-outline-variant p-4 mb-4">
          <p className="text-body-sm font-body-sm text-on-surface leading-relaxed italic">
            "{state.draft_message}"
          </p>
        </div>

        {/* Reasoning pills */}
        {state.reasoning.length > 0 && (
          <div className="mb-5 flex flex-col gap-1.5">
            {state.reasoning.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="material-symbols-outlined text-xs text-on-surface-variant mt-0.5 shrink-0">
                  check_small
                </span>
                <p className="text-label-caps font-label-caps text-on-surface-variant leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setState({ phase: 'approved', clientName: state.phase === 'staged' ? state.client.name : '' })}
            className="flex-1 py-3 bg-primary text-on-primary text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
          >
            APPROVE &amp; SEND
          </button>
          <button
            onClick={() => setState({ phase: 'discarded' })}
            className="flex-1 py-3 border border-outline-variant text-on-surface-variant text-label-caps font-label-caps hover:bg-surface-container transition-colors"
          >
            DISCARD
          </button>
        </div>
      </div>
    </div>
  )
}