'use client'

import { useRef, useState, useTransition } from 'react'
import { addClient } from '@/app/clients/actions'

export function AddClientDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(formRef.current!)
    startTransition(async () => {
      const result = await addClient(formData)
      if (result.error) { setError(result.error); return }
      formRef.current?.reset()
      onClose()
    })
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative h-full w-full max-w-lg bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-7 border-b border-outline-variant bg-surface-container-low">
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">New Client</p>
            <h2 className="font-headline-md text-headline-md text-primary">Add Client Profile</h2>
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

          {[
            { name: 'name',  label: 'Full Name *', type: 'text',  required: true,  placeholder: 'e.g. Adaeze Okonkwo' },
            { name: 'phone', label: 'Phone',       type: 'tel',   required: false, placeholder: '+234 801 234 5678'  },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2 uppercase">
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 text-body-lg font-body-lg text-on-surface placeholder:text-outline-variant transition-colors"
              />
            </div>
          ))}

          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-4">
              Initial Measurements (cm)
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {['bust', 'waist', 'hips', 'inseam'].map((key) => (
                <div key={key} className="border-b border-outline-variant focus-within:border-primary pb-2 transition-colors">
                  <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2 uppercase text-[10px]">
                    {key}
                  </label>
                  <input
                    name={`measurement_${key}`}
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="—"
                    className="w-full bg-transparent outline-none font-data-mono text-body-lg text-primary placeholder:text-outline-variant"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-outline-variant text-on-surface-variant text-label-caps font-label-caps hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="flex-1 py-3 bg-primary text-on-primary text-label-caps font-label-caps hover:opacity-90 transition-opacity disabled:opacity-50">
              {isPending ? 'Adding…' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}