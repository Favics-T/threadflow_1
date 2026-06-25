'use client'

import { useRef, useState, useTransition } from 'react'
import { createCollection } from '@/app/collections/actions'
import type { Collection } from '@/types/threadflow'

export function AddCollectionModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (collection: Collection) => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(formRef.current!)
    const name = String(formData.get('name') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const piecesRaw = String(formData.get('pieces_available') ?? '').trim()

    if (!name) {
      setError('Collection name is required.')
      return
    }

    startTransition(async () => {
      const result = await createCollection(formData)
      if (result.error) {
        setError(result.error)
        return
      }
      onCreated({
        id: `temp-${Date.now()}`,
        name,
        description,
        pieces_available: piecesRaw ? Number(piecesRaw) || 0 : 0,
        created_at: new Date().toISOString(),
      })
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-md bg-surface-container-lowest border border-outline-variant shadow-2xl">
        <div className="flex items-center justify-between px-8 py-7 border-b border-outline-variant bg-surface-container-low">
          <h2 className="font-headline-md text-headline-md text-primary">New Collection</h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 px-8 py-8">
          {error && (
            <div className="px-4 py-3 bg-error-container text-on-error-container text-body-sm font-body-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2 uppercase">
              Name *
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Owambe Ready-to-Wear"
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
              placeholder="What's in this collection?"
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 text-body-lg font-body-lg text-on-surface placeholder:text-outline-variant transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2 uppercase">
              Pieces Available
            </label>
            <input
              name="pieces_available"
              type="number"
              min="0"
              placeholder="0"
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 text-body-lg font-body-lg text-on-surface placeholder:text-outline-variant transition-colors"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-outline-variant text-on-surface-variant text-label-caps font-label-caps hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="flex-1 py-3 bg-primary text-on-primary text-label-caps font-label-caps hover:opacity-90 transition-opacity disabled:opacity-50">
              {isPending ? 'Creating…' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
