'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PipelineSection } from './PipelineSection'
import { PlatformBadge } from './PlatformBadge'
import { mockUnrespondedMessages } from '@/lib/mock/conversations'
import type { UnrespondedMessage, DraftResult } from '@/lib/types/conversations'

type ConversationPriority = UnrespondedMessage['priority']

const PRIORITY_STYLE: Record<ConversationPriority, { label: string; className: string }> = {
  high:   { label: 'HIGH PRIORITY',   className: 'bg-error-container text-on-error-container' },
  normal: { label: 'NORMAL',          className: 'bg-surface-container text-on-surface-variant' },
  low:    { label: 'LOW',             className: 'bg-surface-container text-on-surface-variant' },
}

export function UnrespondedMessages() {
  const [messages, setMessages] = useState<UnrespondedMessage[]>(mockUnrespondedMessages)
  const [drafting, setDrafting] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, DraftResult | { error: string }>>({})
  const [approved, setApproved] = useState<string[]>([])
  const [discarded, setDiscarded] = useState<string[]>([])

  async function handleGenerateDraft(msg: UnrespondedMessage) {
    setDrafting(msg.id)
    try {
      const res = await fetch('/api/agent/draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName: msg.clientName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Agent error')
      setDrafts((prev) => ({ ...prev, [msg.id]: data }))
    } catch (err) {
      setDrafts((prev) => ({
        ...prev,
        [msg.id]: { error: err instanceof Error ? err.message : 'Something went wrong' },
      }))
    } finally {
      setDrafting(null)
    }
  }

  return (
    <PipelineSection
      label="Unresponded Messages"
      count={messages.length}
      description="Client inquiries that have not yet received a reply — respond before they go cold."
    >
      {messages.map((msg) => {
        const priority = PRIORITY_STYLE[msg.priority]
        const isDrafting = drafting === msg.id
        const draft = drafts[msg.id]
        const isApproved = approved.includes(msg.id)
        const isDiscarded = discarded.includes(msg.id)

        return (
          <div
            key={msg.id}
            className="border bg-surface-container-lowest border-outline-variant transition-all"
          >
            {/* Card body */}
            <div className="flex items-start gap-4 px-6 py-5">
              {/* Unread indicator dot */}
              <div className="shrink-0 mt-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Meta row: platform, name, priority, time */}
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <PlatformBadge platform={msg.platform} />

                  <p className="text-body-sm font-body-sm font-semibold text-primary">
                    {msg.clientName}
                  </p>

                  {msg.priority !== 'normal' && msg.priority !== 'low' && (
                    <span className={`text-label-caps font-label-caps px-2 py-0.5 ${priority.className}`}>
                      {priority.label}
                    </span>
                  )}

                  <span className="text-label-caps font-label-caps text-on-surface-variant ml-auto">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Customer message */}
                <p className="text-body-sm font-body-sm text-on-surface leading-relaxed">
                  &ldquo;{msg.message}&rdquo;
                </p>
              </div>
            </div>

            {/* Inline AI draft panel */}
            {draft && !('error' in draft) && !isApproved && !isDiscarded && (
              <div className="mx-6 mb-4 border border-outline-variant bg-surface-container-low">
                <div className="px-4 py-3 border-b border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-tertiary">magic_button</span>
                  <span className="text-label-caps font-label-caps text-on-surface-variant">AI drafted reply</span>
                  <span
                    className={`ml-auto text-label-caps font-label-caps px-2 py-0.5 ${
                      draft.estimate_status === 'on_track'
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                        : draft.estimate_status === 'at_risk'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-error-container text-on-error-container'
                    }`}
                  >
                    {draft.estimate_status === 'on_track'
                      ? 'ON TRACK'
                      : draft.estimate_status === 'at_risk'
                      ? 'AT RISK'
                      : 'BLOCKED'}
                  </span>
                </div>
                <div className="px-4 py-3">
                  <p className="text-body-sm font-body-sm text-on-surface leading-relaxed italic mb-3">
                    &ldquo;{draft.draft_message}&rdquo;
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setApproved((p) => [...p, msg.id])}
                      className="flex-1 py-2 bg-primary text-on-primary text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
                    >
                      APPROVE &amp; SEND
                    </button>
                    <button
                      onClick={() => setDiscarded((p) => [...p, msg.id])}
                      className="flex-1 py-2 border border-outline-variant text-on-surface-variant text-label-caps font-label-caps hover:bg-surface-container transition-colors"
                    >
                      DISCARD
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Draft error */}
            {draft && 'error' in draft && (
              <div className="mx-6 mb-4 flex items-start gap-2 bg-error-container/30 p-3">
                <span className="material-symbols-outlined text-sm text-on-error-container mt-0.5">error</span>
                <p className="text-body-sm font-body-sm text-on-error-container">{draft.error}</p>
              </div>
            )}

            {/* Approved state */}
            {isApproved && (
              <div className="mx-6 mb-4 flex items-center gap-2 bg-tertiary-fixed/40 px-4 py-3">
                <span className="material-symbols-outlined text-sm text-tertiary">check_circle</span>
                <span className="text-label-caps font-label-caps text-on-surface-variant">
                  Reply sent to {msg.clientName}
                </span>
              </div>
            )}

            {/* Discarded state */}
            {isDiscarded && (
              <div className="mx-6 mb-4 px-4 py-3 bg-surface-container">
                <span className="text-label-caps font-label-caps text-on-surface-variant">
                  Reply discarded. No message sent.
                </span>
              </div>
            )}

            {/* Action row */}
            <div className="flex items-center gap-3 px-6 py-3 border-t border-outline-variant bg-surface-container-low/40">
              {isDrafting ? (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant animate-spin">
                    progress_activity
                  </span>
                  <span className="text-label-caps font-label-caps text-on-surface-variant">
                    Agent is drafting a reply…
                  </span>
                </div>
              ) : !draft && !isApproved && !isDiscarded ? (
                <>
                  <button
                    id={`draft-reply-${msg.id}`}
                    onClick={() => handleGenerateDraft(msg)}
                    className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-sm">magic_button</span>
                    GENERATE AI DRAFT
                  </button>
                  <Link
                    id={`view-conversation-${msg.id}`}
                    href={`/agent?prompt=${encodeURIComponent(`Show me the conversation with ${msg.clientName}`)}`}
                    className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant px-4 py-2 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">forum</span>
                    VIEW CONVERSATION
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        )
      })}
    </PipelineSection>
  )
}
