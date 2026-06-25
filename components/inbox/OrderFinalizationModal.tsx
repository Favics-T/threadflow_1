'use client'

import { useRef, useState, useTransition } from 'react'
import { finalizeOrder } from '@/app/inbox/actions'
import type { Message, OrderType } from '@/types/threadflow'

export function OrderFinalizationModal({
  message,
  onClose,
  onFinalized,
  showToast,
}: {
  message: Message
  onClose: () => void
  onFinalized: (messageId: string) => void
  showToast: (message: string, variant?: 'success' | 'error') => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [orderType, setOrderType] = useState<OrderType>('bespoke')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(formRef.current!)
    const clothType = String(formData.get('cloth_type') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const deadline = String(formData.get('deadline') ?? '').trim()

    if (!clothType || !deadline) {
      setError('Cloth type and deadline are required.')
      return
    }

    startTransition(async () => {
      const result = await finalizeOrder({
        messageId: message.id,
        clientName: message.client_name,
        clothType,
        description,
        deadline,
        orderType,
      })

      if (result.error) {
        setError(result.error)
        return
      }

      onFinalized(message.id)
      showToast(`Order created for ${message.client_name}`)
    })
  }

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-end bg-black/30 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative h-full w-full max-w-lg bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-7 border-b border-outline-variant bg-surface-container-low">
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">Finalize as Order</p>
            <h2 className="font-headline-md text-headline-md text-primary">{message.client_name}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 px-8 py-8 flex-grow">
          {error && (
            <div className="px-4 py-3 bg-error-container text-on-error-container text-body-sm font-body-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2 uppercase">
              Cloth Type *
            </label>
            <input
              name="cloth_type"
              type="text"
              required
              placeholder="e.g. Lace Dinner Gown"
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 text-body-lg font-body-lg text-on-surface placeholder:text-outline-variant transition-colors"
            />
          </div>

          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2 uppercase">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Fabric, colour, sizing, and any special details…"
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 text-body-lg font-body-lg text-on-surface placeholder:text-outline-variant transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2 uppercase">
              Deadline *
            </label>
            <input
              name="deadline"
              type="date"
              required
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 text-body-lg font-body-lg text-on-surface transition-colors"
            />
          </div>

          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-2 uppercase">Order Type</p>
            <div className="flex border border-outline-variant">
              {(['bespoke', 'collection'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-2.5 text-label-caps font-label-caps tracking-widest transition-colors ${
                    orderType === type ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {type === 'bespoke' ? 'BESPOKE' : 'COLLECTION'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-outline-variant text-on-surface-variant text-label-caps font-label-caps hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="flex-1 py-3 bg-primary text-on-primary text-label-caps font-label-caps hover:opacity-90 transition-opacity disabled:opacity-50">
              {isPending ? 'Creating…' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
