'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import { updateMeasurements } from '@/app/clients/actions'
import type { MeasurementMap, MeasurementValue } from '@/app/clients/types'

const defaultMeasurements = ['bust', 'waist', 'hip', 'shoulder', 'sleeve', 'inseam']

function displayValue(value: MeasurementValue) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  return String(value)
}

function parseValue(value: string): MeasurementValue {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const number = Number(trimmed)
  return Number.isFinite(number) ? number : trimmed
}

type MeasurementsEditorProps = {
  clientId: string
  measurements: MeasurementMap
}

export function MeasurementsEditor({
  clientId,
  measurements,
}: MeasurementsEditorProps) {
  const router = useRouter()
  const [localMeasurements, setLocalMeasurements] = useState(measurements)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [draftValue, setDraftValue] = useState('')
  const [isPending, startTransition] = useTransition()

  const keys = useMemo(() => {
    const merged = new Set([...defaultMeasurements, ...Object.keys(localMeasurements)])
    return Array.from(merged)
  }, [localMeasurements])

  function startEditing(key: string) {
    setEditingKey(key)
    setDraftValue(displayValue(localMeasurements[key]) === '—' ? '' : displayValue(localMeasurements[key]))
  }

  function saveMeasurement(key: string) {
    const next = {
      ...localMeasurements,
      [key]: parseValue(draftValue),
    }

    setLocalMeasurements(next)
    setEditingKey(null)

    startTransition(async () => {
      await updateMeasurements(clientId, next)
      router.refresh()
    })
  }

  return (
    <div className="mt-5 grid grid-cols-2 border border-outline-variant md:grid-cols-3">
      {keys.map((key) => (
        <div
          key={key}
          className="min-h-24 border-b border-r border-outline-variant/30 px-5 py-4 last:border-r-0"
        >
          <p className="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant">
            {key.replaceAll('_', ' ')}
          </p>

          {editingKey === key ? (
            <form
              action={() => saveMeasurement(key)}
              className="mt-3 flex items-center gap-2"
            >
              <input
                autoFocus
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
                onBlur={() => saveMeasurement(key)}
                className="min-w-0 flex-1 border-b border-primary bg-transparent py-1 text-data-mono font-data-mono text-primary outline-none"
              />
              <button
                type="submit"
                disabled={isPending}
                aria-label="Save measurement"
                className="flex h-8 w-8 items-center justify-center bg-primary text-on-primary disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">check</span>
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => startEditing(key)}
              className="mt-3 block w-full text-left text-data-mono font-data-mono text-primary hover:text-on-surface-variant"
            >
              {displayValue(localMeasurements[key])}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
