'use client'

import { useRef, useState, useTransition } from 'react'
import { createOrder } from '@/app/clients/actions'
import type { StudioClient } from '@/app/clients/types'

export function AddOrderDrawer({
  client,
  open,
  onClose,
}: {
  client: StudioClient | null
  open: boolean
  onClose: () => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(formRef.current!)
    startTransition(async () => {
      const result = await createOrder(formData)
      if (result.error) { setError(result.error); return }
      formRef.current?.reset()
      onClose()
    })
  }

  if (!open || !client) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative h-full w-full max-w-lg bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-7 border-b border-outline-variant bg-surface-container-low">
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">New Order</p>
            <h2 className="font-headline-md text-headline-md text-primary">{client.name}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 px-8 py-8 flex-grow">
          <input type="hidden" name="client_id" value={client.id} />

          {error && (
            <div className="px-4 py-3 bg-error-container text-on-error-container text-body-sm font-body-sm">
              {error}
            </div>
          )}

          {[
            { name: 'garment_type',      label: 'Garment Type',      type: 'text',   placeholder: 'e.g. Ankara Evening Gown' },
            { name: 'yards_required',    label: 'Fabric Required (yds)', type: 'number', placeholder: '6' },
            { name: 'delivery_estimate', label: 'Target Delivery',   type: 'date',   placeholder: '' },
            { name: 'image_url',         label: 'Outfit Image URL',  type: 'url',    placeholder: 'https://...' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2 uppercase">
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 text-body-lg font-body-lg text-on-surface placeholder:text-outline-variant transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2 uppercase">
              Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Fitting notes, client preferences, special instructions…"
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 text-body-lg font-body-lg text-on-surface placeholder:text-outline-variant transition-colors resize-none"
            />
          </div>

          <div className="mt-auto pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-outline-variant text-on-surface-variant text-label-caps font-label-caps hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="flex-1 py-3 bg-primary text-on-primary text-label-caps font-label-caps hover:opacity-90 transition-opacity disabled:opacity-50">
              {isPending ? 'Creating…' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}