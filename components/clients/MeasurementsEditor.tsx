'use client'

import { useState, useTransition } from 'react'
import { updateMeasurements } from '@/app/clients/actions'
import type { MeasurementMap, StudioClient } from '@/app/clients/types'

const MEASUREMENT_FIELDS = [
  { key: 'bust',              label: 'Bust' },
  { key: 'underbust',         label: 'Underbust' },
  { key: 'waist',             label: 'Waist' },
  { key: 'hips',              label: 'Hips' },
  { key: 'inseam',            label: 'Inseam' },
  { key: 'shoulder_to_waist', label: 'Shoulder → Waist' },
  { key: 'arm_length',        label: 'Arm Length' },
  { key: 'neck',              label: 'Neck' },
]

export function MeasurementsEditor({ client }: { client: StudioClient }) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      MEASUREMENT_FIELDS.map((f) => [
        f.key,
        String(client.measurements?.[f.key] ?? ''),
      ])
    )
  )

  function handleSave() {
    setError(null)
    const updated: MeasurementMap = {}
    for (const { key } of MEASUREMENT_FIELDS) {
      const val = draft[key].trim()
      if (!val) continue
      const n = parseFloat(val)
      if (isNaN(n)) { setError(`Invalid value for ${key}`); return }
      updated[key] = n
    }
    startTransition(async () => {
      const result = await updateMeasurements(client.id, updated)
      if (result.error) { setError(result.error); return }
      setEditing(false)
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Body Measurements (cm)
          </p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-1.5 border border-outline-variant text-label-caps font-label-caps text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-4 py-1.5 bg-primary text-on-primary text-label-caps font-label-caps hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 border border-outline-variant text-label-caps font-label-caps text-on-surface-variant hover:bg-surface-container hover:border-primary hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-error-container text-on-error-container text-body-sm font-body-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-8">
        {MEASUREMENT_FIELDS.map(({ key, label }) => (
          <div
            key={key}
            className={`pb-2 border-b transition-colors ${editing ? 'border-primary/40' : 'border-outline-variant'}`}
          >
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-3 uppercase">
              {label}
            </label>
            {editing ? (
              <input
                type="number"
                step="0.1"
                min="0"
                value={draft[key]}
                onChange={(e) => setDraft((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full bg-transparent outline-none font-data-mono text-headline-md text-primary placeholder:text-outline-variant"
                placeholder="—"
              />
            ) : (
              <span className="font-data-mono text-headline-md text-primary">
                {client.measurements?.[key] ?? (
                  <span className="text-outline-variant text-body-lg">—</span>
                )}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}