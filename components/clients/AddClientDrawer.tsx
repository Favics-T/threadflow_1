'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { addClient } from '@/app/clients/actions'

const starterMeasurements = ['bust', 'waist', 'hip', 'shoulder']

type AddClientDrawerProps = {
  open: boolean
  onClose: () => void
}

export function AddClientDrawer({ open, onClose }: AddClientDrawerProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!open) {
    return null
  }

  function submit(formData: FormData) {
    setError(null)

    startTransition(async () => {
      const result = await addClient(formData)

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
        aria-label="Close add client drawer"
        onClick={onClose}
        className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
      />

      <aside className="animate-slide-in-right absolute right-0 top-0 h-full w-[460px] border-l border-outline-variant bg-surface-container-lowest shadow-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant px-7 py-6">
          <div>
            <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
              New Record
            </span>
            <h2 className="mt-0.5 font-headline-md text-headline-md text-primary">
              Add Client
            </h2>
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

        <form ref={formRef} action={submit} className="flex h-[calc(100%-89px)] flex-col">
          <div className="hide-scrollbar flex-1 overflow-y-auto px-7 py-6">
            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                  Name
                </span>
                <input
                  name="name"
                  required
                  className="border border-outline-variant bg-surface-container-low px-4 py-3 text-body-sm font-body-sm text-primary outline-none focus:border-primary"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                  Phone
                </span>
                <input
                  name="phone"
                  className="border border-outline-variant bg-surface-container-low px-4 py-3 text-body-sm font-body-sm text-primary outline-none focus:border-primary"
                />
              </label>

              <div>
                <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                  Measurements
                </span>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {starterMeasurements.map((measurement) => (
                    <label key={measurement} className="grid gap-2">
                      <span className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
                        {measurement}
                      </span>
                      <input
                        name={`measurement_${measurement}`}
                        inputMode="decimal"
                        className="border border-outline-variant bg-surface-container-low px-4 py-3 text-data-mono font-data-mono text-primary outline-none focus:border-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>
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
