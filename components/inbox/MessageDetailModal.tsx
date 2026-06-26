'use client'

import { useEffect, useState, useTransition } from 'react'
import { SourceBadge } from '@/components/ui/SourceBadge'
import { CategoryTag } from './CategoryTag'
import { approveAndSend, approveOrder, confirmSuggestedAssignment, getOrderForMessage } from '@/app/inbox/actions'
import type { Message } from '@/types/threadflow'
import type { BoardOrder } from '@/lib/supabase/orders'
import type { AssignmentSuggestion } from '@/lib/assignment-engine'

export function MessageDetailModal({
  message,
  onClose,
  onApproved,
  onRequestFinalize,
  showToast,
}: {
  message: Message
  onClose: () => void
  onApproved: (patch: Partial<Message> & { id: string }) => void
  onRequestFinalize: () => void
  showToast: (message: string, variant?: 'success' | 'error') => void
}) {
  const [draftText, setDraftText] = useState(message.ai_draft ?? '')
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [order, setOrder] = useState<BoardOrder | null>(null)
  const [suggestion, setSuggestion] = useState<AssignmentSuggestion | null>(null)
  const [isApproving, startApproving] = useTransition()
  const [isAssigning, startAssigning] = useTransition()

  useEffect(() => {
    if (message.status !== 'pending_approval' && message.status !== 'finalized') return

    getOrderForMessage(message.id).then(({ order }) => {
      setOrder(order)
    })
  }, [message.id, message.status])

  async function handleGenerateDraft() {
    setIsGenerating(true)
    setGenError(null)
    try {
      const res = await fetch('/api/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate draft')
      setDraftText(data.draft)
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsGenerating(false)
    }
  }

  function handleSend() {
    startTransition(async () => {
      const result = await approveAndSend(message.id, draftText)
      if (result.error) {
        showToast(result.error, 'error')
        return
      }
      onApproved({
        id: message.id,
        status: 'responded',
        ai_draft: draftText,
        approved_at: new Date().toISOString(),
      })
      setIsEditing(false)
      showToast(`Reply sent to ${message.client_name}`)
    })
  }

  function handleApproveOrder() {
    startApproving(async () => {
      const result = await approveOrder(message.id)
      if (!result.ok) {
        showToast(result.error ?? 'Something went wrong.', 'error')
        return
      }
      setOrder((prev) => (prev ? { ...prev, tailor_confirmed: true } : prev))
      setSuggestion(result.suggestion ?? null)
      onApproved({ id: message.id, status: 'finalized' })
      showToast(`Order confirmed for ${message.client_name}`)
    })
  }

  function handleConfirmAssignment() {
    if (!order || !suggestion) return

    startAssigning(async () => {
      const result = await confirmSuggestedAssignment({
        orderId: order.id,
        tailorId: suggestion.tailorId,
        roleDescription: `Primary tailor for ${suggestion.clothType}`,
        reasoning: suggestion.reasoning,
      })
      if (result.error) {
        showToast(result.error, 'error')
        return
      }
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: 'in_production',
              assignment: {
                assignmentId: '',
                tailorId: suggestion.tailorId,
                tailorName: suggestion.tailorName,
                specialty: null,
                roleDescription: `Primary tailor for ${suggestion.clothType}`,
                reasoning: suggestion.reasoning,
                approvedByTailor: false,
                editedByTailor: false,
                assignedAt: new Date().toISOString(),
              },
            }
          : prev
      )
      setSuggestion(null)
      showToast(`${suggestion.tailorName} assigned to this order.`)
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative h-full w-full max-w-xl bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-7 border-b border-outline-variant bg-surface-container-low">
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">Message</p>
            <h2 className="font-headline-md text-headline-md text-primary">{message.client_name}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-6 px-8 py-8 flex-grow">
          <div className="flex items-center gap-3 flex-wrap">
            <SourceBadge source={message.source} />
            <CategoryTag category={message.category} />
            <span className="text-label-caps font-label-caps text-on-surface-variant ml-auto">
              {message.client_contact}
            </span>
          </div>

          <div className="bg-surface-container-low border border-outline-variant p-4">
            <p className="text-body-lg font-body-lg text-on-surface leading-relaxed">
              &ldquo;{message.content}&rdquo;
            </p>
          </div>

          <div className="border border-outline-variant">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant bg-surface-container-low">
              <span className="material-symbols-outlined text-sm text-tertiary">magic_button</span>
              <span className="text-label-caps font-label-caps text-on-surface-variant">AI Draft Response</span>
            </div>

            <div className="px-4 py-4">
              {genError && (
                <div className="flex items-start gap-2 mb-4 bg-error-container/30 p-3">
                  <span className="material-symbols-outlined text-sm text-on-error-container mt-0.5">error</span>
                  <p className="text-body-sm font-body-sm text-on-error-container">{genError}</p>
                </div>
              )}

              {!draftText && !isGenerating && (
                <button
                  onClick={handleGenerateDraft}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-sm">magic_button</span>
                  GENERATE AI DRAFT
                </button>
              )}

              {isGenerating && (
                <div className="flex items-center gap-2 py-3 justify-center">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant animate-spin">progress_activity</span>
                  <span className="text-label-caps font-label-caps text-on-surface-variant">Drafting with Gemini…</span>
                </div>
              )}

              {draftText && !isEditing && (
                <p className="text-body-sm font-body-sm text-on-surface leading-relaxed italic mb-4">
                  &ldquo;{draftText}&rdquo;
                </p>
              )}

              {draftText && isEditing && (
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  rows={5}
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary outline-none p-3 text-body-sm font-body-sm text-on-surface mb-4 resize-none"
                />
              )}

              {draftText && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSend}
                    disabled={isPending}
                    className="flex-1 py-2.5 bg-primary text-on-primary text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isPending ? 'SENDING…' : isEditing ? 'SEND EDITED' : 'APPROVE & SEND'}
                  </button>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      disabled={isPending}
                      className="flex-1 py-2.5 border border-outline-variant text-on-surface-variant text-label-caps font-label-caps hover:bg-surface-container transition-colors disabled:opacity-50"
                    >
                      EDIT
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {message.status === 'pending_approval' && (
            <div className="border border-outline-variant">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant bg-surface-container-low">
                <span className="material-symbols-outlined text-sm text-warning">pending</span>
                <span className="text-label-caps font-label-caps text-on-surface-variant">
                  Order Drafted — Waiting Tailor Approval
                </span>
              </div>
              <div className="px-4 py-4 flex flex-col gap-3">
                {order && (
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    {order.cloth_type} — due {new Date(order.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  This was submitted from the conversation but is not a real order until the tailor confirms it.
                </p>
                <button
                  onClick={handleApproveOrder}
                  disabled={isApproving || !order}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">task_alt</span>
                  {isApproving ? 'APPROVING…' : 'APPROVE AS ORDER'}
                </button>
              </div>
            </div>
          )}

          {message.status === 'finalized' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-tertiary-fixed/40 px-4 py-3">
                <span className="material-symbols-outlined text-sm text-tertiary">check_circle</span>
                <span className="text-label-caps font-label-caps text-on-surface-variant">Converted to order</span>
              </div>

              {suggestion && (
                <div className="border border-primary/40 bg-primary/5 px-4 py-4 flex flex-col gap-3">
                  <p className="text-body-sm font-body-sm font-semibold text-primary">
                    Suggested tailor: {suggestion.tailorName}
                  </p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">{suggestion.reasoning}</p>
                  <button
                    onClick={handleConfirmAssignment}
                    disabled={isAssigning}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    {isAssigning ? 'ASSIGNING…' : 'CONFIRM ASSIGNMENT'}
                  </button>
                </div>
              )}

              {!suggestion && order?.assignment && (
                <div className="border border-outline-variant px-4 py-4 flex flex-col gap-1">
                  <p className="text-body-sm font-body-sm font-semibold text-primary">
                    Assigned to {order.assignment.tailorName}
                  </p>
                  {order.assignment.reasoning && (
                    <p className="text-body-sm font-body-sm text-on-surface-variant italic">
                      {order.assignment.reasoning}
                    </p>
                  )}
                </div>
              )}

              {!suggestion && order && !order.assignment && (
                <div className="flex items-center justify-between gap-3 border border-outline-variant px-4 py-3">
                  <span className="text-label-caps font-label-caps px-2 py-0.5 bg-surface-container text-on-surface-variant">
                    UNASSIGNED
                  </span>
                  <a href="/tailors" className="text-label-caps font-label-caps text-primary hover:underline">
                    ASSIGN MANUALLY
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {message.status === 'responded' && (
          <div className="px-8 py-6 border-t border-outline-variant bg-surface-container-low/40">
            <button
              onClick={onRequestFinalize}
              className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              FINALIZE AS ORDER
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
