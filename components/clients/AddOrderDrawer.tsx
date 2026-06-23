'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { createOrder } from '@/app/clients/actions'
import type { StudioClient } from '@/app/clients/types'

type AddOrderDrawerProps = {
  client: StudioClient | null
  open: boolean
  onClose: () => void
}

export function AddOrderDrawer({ client, open, onClose }: AddOrderDrawerProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!open || !client) {
    return null
  }

  function submit(formData: FormData) {
    setError(null)

    startTransition(async () => {
      const result = await createOrder(formData)

      if (result?.error) {
        setError(result.error)
        return
      }

      formRef.current?.reset()
      router.refresh()
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close add order drawer"
        onClick={onClose}
        className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
      />

      <aside className="animate-slide-in-right absolute right-0 top-0 h-full w-[500px] border-l border-outline-variant bg-surface-container-lowest shadow-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant px-7 py-6">
          <div>
            <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
              Production
            </span>
            <h2 className="mt-0.5 font-headline-md text-headline-md text-primary">
              Add Order
            </h2>
            <p className="mt-1 text-body-sm font-body-sm text-on-surface-variant">
              {client.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex h-10 w-10 items-center justify-center bg-surface-container-low text-primary hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form ref={formRef} action={submit} className="flex h-[calc(100%-112px)] flex-col">
          <input type="hidden" name="client_id" value={client.id} />

          <div className="hide-scrollbar flex-1 overflow-y-auto px-7 py-6">
            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                  Garment Type
                </span>
                <input
                  name="garment_type"
                  placeholder="Bias gown, agbada, bridal fitting"
                  className="border border-outline-variant bg-surface-container-low px-4 py-3 text-body-sm font-body-sm text-primary outline-none placeholder:text-on-surface-variant/60 focus:border-primary"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-2">
                  <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                    Status
                  </span>
                  <select
                    name="status"
                    defaultValue="pending"
                    className="border border-outline-variant bg-surface-container-low px-4 py-3 text-body-sm font-body-sm text-primary outline-none focus:border-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                    Yards
                  </span>
                  <input
                    name="yards_required"
                    inputMode="decimal"
                    className="border border-outline-variant bg-surface-container-low px-4 py-3 text-data-mono font-data-mono text-primary outline-none focus:border-primary"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                  Delivery Estimate
                </span>
                <input
                  name="delivery_estimate"
                  type="date"
                  className="border border-outline-variant bg-surface-container-low px-4 py-3 text-data-mono font-data-mono text-primary outline-none focus:border-primary"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                  Outfit Image URL
                </span>
                <input
                  name="image_url"
                  type="url"
                  placeholder="https://..."
                  className="border border-outline-variant bg-surface-container-low px-4 py-3 text-body-sm font-body-sm text-primary outline-none placeholder:text-on-surface-variant/60 focus:border-primary"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                  Notes
                </span>
                <textarea
                  name="notes"
                  rows={6}
                  className="resize-none border border-outline-variant bg-surface-container-low px-4 py-3 text-body-sm font-body-sm text-primary outline-none focus:border-primary"
                />
              </label>
            </div>

            {error ? (
              <p className="mt-5 border border-error bg-error-container px-4 py-3 text-body-sm font-body-sm text-on-error-container">
                {error}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-outline-variant px-7 py-5">
            <button
              type="button"
              onClick={onClose}
              className="bg-surface-container-low px-5 py-3 text-label-caps font-label-caps uppercase tracking-widest text-primary hover:bg-surface-container-high"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-primary px-5 py-3 text-label-caps font-label-caps uppercase tracking-widest text-on-primary disabled:opacity-50"
            >
              {isPending ? 'Saving' : 'Create'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}
