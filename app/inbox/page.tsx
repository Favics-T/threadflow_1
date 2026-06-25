'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  mockNoResponseMessages,
  mockPendingConversations,
  mockDoneConversations,
} from '@/lib/mock/conversations'
import type {
  NoResponseMessage,
  PendingConversation,
  DoneConversation,
  DraftResult,
} from '@/lib/types/conversations'

// ── Platform config ───────────────────────────────────────────────────────────
const PLATFORM_CONFIG = {
  instagram: { label: 'Instagram', icon: 'photo_camera', color: '#E1306C', bg: '#E1306C15' },
  whatsapp:  { label: 'WhatsApp',  icon: 'chat',         color: '#25D366', bg: '#25D36615' },
  website:   { label: 'Website',   icon: 'language',     color: '#4F46E5', bg: '#4F46E515' },
  facebook:  { label: 'Facebook',  icon: 'thumb_up',     color: '#1877F2', bg: '#1877F215' },
} as const

function PlatformBadge({ platform }: { platform: keyof typeof PLATFORM_CONFIG }) {
  const cfg = PLATFORM_CONFIG[platform]
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ backgroundColor: cfg.bg }}>
      <span className="material-symbols-outlined" style={{ color: cfg.color, fontSize: '14px' }}>
        {cfg.icon}
      </span>
      <span className="text-label-caps font-label-caps" style={{ color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function InboxSection({
  label,
  count,
  description,
  children,
}: {
  label: string
  count: number
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-12">
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            {label}
          </h2>
          <span className="bg-surface-container text-on-surface-variant text-label-caps font-label-caps px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        <p className="text-body-sm font-body-sm text-on-surface-variant">{description}</p>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}

// ── Stage 1: No Response ──────────────────────────────────────────────────────
function NoResponseSection() {
  const [messages, setMessages] = useState<NoResponseMessage[]>(mockNoResponseMessages)
  const [drafting, setDrafting] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, DraftResult | { error: string }>>({})
  const [approved, setApproved] = useState<string[]>([])
  const [discarded, setDiscarded] = useState<string[]>([])

  async function handleGenerateDraft(msg: NoResponseMessage) {
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

  const highCount = messages.filter((m) => m.priority === 'high').length

  return (
    <InboxSection
      label="No Response"
      count={messages.length}
      description={
        highCount > 0
          ? `${highCount} high-priority — clients are waiting`
          : 'All messages have been responded to'
      }
    >
      {messages.map((msg) => {
        const isDrafting = drafting === msg.id
        const draft = drafts[msg.id]
        const isApproved = approved.includes(msg.id)
        const isDiscarded = discarded.includes(msg.id)

        return (
          <div
            key={msg.id}
            className={`border bg-surface-container-lowest transition-all ${
              msg.priority === 'high' ? 'border-error-container' : 'border-outline-variant'
            }`}
          >
            <div className="flex items-start gap-4 px-6 py-5">
              <div className="shrink-0 mt-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <PlatformBadge platform={msg.platform} />
                  <p className="text-body-sm font-body-sm font-semibold text-primary">
                    {msg.clientName}
                  </p>
                  {msg.priority === 'high' && (
                    <span className="text-label-caps font-label-caps px-2 py-0.5 bg-error-container text-on-error-container">
                      HIGH PRIORITY
                    </span>
                  )}
                  <span className="text-label-caps font-label-caps text-on-surface-variant ml-auto">
                    {msg.timestamp}
                  </span>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface leading-relaxed">
                  &ldquo;{msg.message}&rdquo;
                </p>
              </div>
            </div>

            {/* Inline AI draft */}
            {draft && !('error' in draft) && !isApproved && !isDiscarded && (
              <div className="mx-6 mb-4 border border-outline-variant bg-surface-container-low">
                <div className="px-4 py-3 border-b border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-tertiary">magic_button</span>
                  <span className="text-label-caps font-label-caps text-on-surface-variant">
                    AI drafted reply
                  </span>
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

            {draft && 'error' in draft && (
              <div className="mx-6 mb-4 flex items-start gap-2 bg-error-container/30 p-3">
                <span className="material-symbols-outlined text-sm text-on-error-container mt-0.5">
                  error
                </span>
                <p className="text-body-sm font-body-sm text-on-error-container">{draft.error}</p>
              </div>
            )}

            {isApproved && (
              <div className="mx-6 mb-4 flex items-center gap-2 bg-tertiary-fixed/40 px-4 py-3">
                <span className="material-symbols-outlined text-sm text-tertiary">check_circle</span>
                <span className="text-label-caps font-label-caps text-on-surface-variant">
                  Reply sent to {msg.clientName}
                </span>
              </div>
            )}

            {isDiscarded && (
              <div className="mx-6 mb-4 px-4 py-3 bg-surface-container">
                <span className="text-label-caps font-label-caps text-on-surface-variant">
                  Reply discarded. No message sent.
                </span>
              </div>
            )}

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
                    onClick={() => handleGenerateDraft(msg)}
                    className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-sm">magic_button</span>
                    GENERATE AI DRAFT
                  </button>
                  <Link
                    href={`/agent?prompt=${encodeURIComponent(`Show me the conversation with ${msg.clientName}`)}`}
                    className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant px-4 py-2 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">forum</span>
                    VIEW THREAD
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        )
      })}
    </InboxSection>
  )
}

// ── Stage 2: Pending ──────────────────────────────────────────────────────────
function PendingSection() {
  const [conversations, setConversations] = useState<PendingConversation[]>(
    mockPendingConversations
  )
  const [marking, setMarking] = useState<string[]>([])

  function handleMarkDone(id: string) {
    setMarking((prev) => [...prev, id])
    setTimeout(() => {
      setConversations((prev) => prev.filter((c) => c.id !== id))
      setMarking((prev) => prev.filter((m) => m !== id))
    }, 800)
  }

  return (
    <InboxSection
      label="Pending"
      count={conversations.length}
      description="Conversations in progress — collect all details before marking as done."
    >
      {conversations.map((conv) => {
        const isMarking = marking.includes(conv.id)
        return (
          <div
            key={conv.id}
            className={`border bg-surface-container-lowest border-outline-variant transition-all ${
              isMarking ? 'opacity-50 scale-[0.99]' : ''
            }`}
          >
            <div className="px-6 py-5 border-b border-outline-variant">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <PlatformBadge platform={conv.platform} />
                  <div>
                    <p className="text-body-sm font-body-sm font-semibold text-primary mb-1">
                      {conv.clientName}
                    </p>
                    <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                      {conv.summary}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-label-caps font-label-caps px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant whitespace-nowrap">
                    IN DISCUSSION
                  </span>
                  <span className="text-label-caps font-label-caps text-on-surface-variant">
                    {conv.lastMessageAt}
                  </span>
                </div>
              </div>
            </div>

            {/* Collected / Missing checklist */}
            <div className="px-6 py-5 grid grid-cols-2 gap-6">
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-3">
                  Collected
                </p>
                <ul className="flex flex-col gap-2">
                  {conv.collectedInfo.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        className="material-symbols-outlined text-tertiary mt-px"
                        style={{ fontSize: '16px', fontVariationSettings: '"FILL" 1' }}
                      >
                        check_circle
                      </span>
                      <span className="text-body-sm font-body-sm text-on-surface">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-3">
                  Still Needed
                </p>
                <ul className="flex flex-col gap-2">
                  {conv.missingInfo.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        className="material-symbols-outlined text-on-surface-variant mt-px"
                        style={{ fontSize: '16px' }}
                      >
                        radio_button_unchecked
                      </span>
                      <span className="text-body-sm font-body-sm text-on-surface-variant">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 border-t border-outline-variant bg-surface-container-low/40">
              {isMarking ? (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant animate-spin">
                    progress_activity
                  </span>
                  <span className="text-label-caps font-label-caps text-on-surface-variant">
                    Pushing to Orders…
                  </span>
                </div>
              ) : (
                <>
                  <button className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined text-sm">edit_note</span>
                    DRAFT FOLLOW-UP
                  </button>
                  <button
                    onClick={() => handleMarkDone(conv.id)}
                    className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant px-4 py-2 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">task_alt</span>
                    MARK AS DONE
                  </button>
                </>
              )}
            </div>
          </div>
        )
      })}
    </InboxSection>
  )
}

// ── Stage 3: Done ─────────────────────────────────────────────────────────────
function DoneSection() {
  const conversations = mockDoneConversations

  return (
    <InboxSection
      label="Done"
      count={conversations.length}
      description="Conversations concluded — delivery confirmed and pushed to Orders for production."
    >
      {conversations.map((conv) => (
        <div key={conv.id} className="border bg-surface-container-lowest border-outline-variant">
          <div className="flex items-center gap-4 px-6 py-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <PlatformBadge platform={conv.platform} />
                <p className="text-body-sm font-body-sm font-semibold text-primary">
                  {conv.clientName}
                </p>
                <span className="text-label-caps font-label-caps px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant">
                  DONE
                </span>
                <span className="ml-auto text-label-caps font-label-caps text-on-surface-variant">
                  {conv.concludedAt}
                </span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface mb-1">
                {conv.garmentDescription}
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-on-surface-variant"
                  style={{ fontSize: '14px' }}
                >
                  calendar_today
                </span>
                <span className="text-label-caps font-label-caps text-on-surface-variant">
                  Delivery: {conv.agreedDeliveryDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 border-t border-outline-variant bg-surface-container-low/40">
            {conv.pushedToOrders ? (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-tertiary">check_circle</span>
                <span className="text-label-caps font-label-caps text-on-surface-variant">
                  Pushed to Orders
                </span>
              </div>
            ) : null}
            <Link
              href="/orders"
              className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant px-4 py-2 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-primary transition-colors ml-auto"
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              VIEW IN ORDERS
            </Link>
          </div>
        </div>
      ))}
    </InboxSection>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InboxPage() {
  const totalUnresponded = mockNoResponseMessages.length
  const totalPending = mockPendingConversations.length

  return (
    <main className="px-10 py-10 pb-16">
      <header className="flex justify-between items-end mb-12">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Client Communication
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Inbox</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            All conversations from Instagram, WhatsApp, Facebook, and your website — in one place.
            {totalUnresponded > 0 && (
              <span className="text-primary font-semibold">
                {' '}{totalUnresponded} unresponded, {totalPending} pending.
              </span>
            )}
          </p>
        </div>
      </header>

      <NoResponseSection />
      <PendingSection />
      <DoneSection />
    </main>
  )
}