'use client'

import { useState } from 'react'
import { PipelineSection } from './PipelineSection'
import { mockConversationsInProgress } from '@/lib/mock/conversations'
import type { ConversationInProgress } from '@/lib/types/conversations'

export function CommunicationInProgress() {
  const [conversations, setConversations] = useState<ConversationInProgress[]>(
    mockConversationsInProgress
  )
  const [finalizing, setFinalizing] = useState<string[]>([])

  function handleMarkFinalized(id: string) {
    // Optimistic: briefly show "finalizing" state, then remove from list
    setFinalizing((prev) => [...prev, id])
    setTimeout(() => {
      setConversations((prev) => prev.filter((c) => c.id !== id))
      setFinalizing((prev) => prev.filter((f) => f !== id))
    }, 800)
  }

  return (
    <PipelineSection
      label="Communication In Progress"
      count={conversations.length}
      description="Orders still being discussed — collect missing details before marking as finalised."
    >
      {conversations.map((conv) => {
        const isFinalizing = finalizing.includes(conv.id)

        return (
          <div
            key={conv.id}
            className={`border bg-surface-container-lowest border-outline-variant transition-all ${
              isFinalizing ? 'opacity-50 scale-[0.99]' : ''
            }`}
          >
            {/* Card header */}
            <div className="px-6 py-5 border-b border-outline-variant">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-body-sm font-body-sm font-semibold text-primary mb-1">
                    {conv.clientName}
                  </p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                    {conv.summary}
                  </p>
                </div>
                <span className="shrink-0 text-label-caps font-label-caps px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant whitespace-nowrap">
                  IN DISCUSSION
                </span>
              </div>
            </div>

            {/* Collected / Missing checklist */}
            <div className="px-6 py-5 grid grid-cols-2 gap-6">
              {/* Collected information */}
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-3">
                  Collected
                </p>
                <ul className="flex flex-col gap-2">
                  {conv.collectedInfo.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-tertiary mt-px"
                        style={{ fontSize: '16px', fontVariationSettings: '"FILL" 1' }}
                      >
                        check_circle
                      </span>
                      <span className="text-body-sm font-body-sm text-on-surface">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing information */}
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-3">
                  Missing
                </p>
                <ul className="flex flex-col gap-2">
                  {conv.missingInfo.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant mt-px"
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

            {/* Action row */}
            <div className="flex items-center gap-3 px-6 py-3 border-t border-outline-variant bg-surface-container-low/40">
              {isFinalizing ? (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant animate-spin">
                    progress_activity
                  </span>
                  <span className="text-label-caps font-label-caps text-on-surface-variant">
                    Marking as finalised…
                  </span>
                </div>
              ) : (
                <>
                  <button
                    id={`draft-followup-${conv.id}`}
                    className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-sm">edit_note</span>
                    DRAFT FOLLOW-UP
                  </button>
                  <button
                    id={`mark-finalized-${conv.id}`}
                    onClick={() => handleMarkFinalized(conv.id)}
                    className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant px-4 py-2 text-label-caps font-label-caps tracking-widest hover:bg-surface-container hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">task_alt</span>
                    MARK AS FINALISED
                  </button>
                </>
              )}
            </div>
          </div>
        )
      })}
    </PipelineSection>
  )
}
