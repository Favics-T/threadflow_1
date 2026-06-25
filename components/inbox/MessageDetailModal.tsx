'use client'

import { useState, useTransition } from 'react'
import { SourceBadge } from '@/components/ui/SourceBadge'
import { CategoryTag } from './CategoryTag'
import { approveAndSend } from '@/app/inbox/actions'
import type { Message } from '@/types/threadflow'

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

          {message.status === 'finalized' && (
            <div className="flex items-center gap-2 bg-tertiary-fixed/40 px-4 py-3">
              <span className="material-symbols-outlined text-sm text-tertiary">check_circle</span>
              <span className="text-label-caps font-label-caps text-on-surface-variant">Converted to order</span>
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
