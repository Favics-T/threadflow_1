'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { MeasurementMap, MeasurementValue } from './types'

function optionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return text.length > 0 ? text : null
}

function optionalNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  if (!text) {
    return null
  }

  const number = Number(text)
  return Number.isFinite(number) ? number : null
}

function parseMeasurementValue(value: string): MeasurementValue {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const number = Number(trimmed)
  return Number.isFinite(number) ? number : trimmed
}

export async function addClient(formData: FormData) {
  const supabase = createClient()
  const name = optionalString(formData.get('name'))

  if (!name) {
    return { error: 'Client name is required.' }
  }

  const measurements: MeasurementMap = {}

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('measurement_')) {
      continue
    }

    const measurementKey = key.replace('measurement_', '')
    const parsedValue = parseMeasurementValue(String(value))

    if (measurementKey && parsedValue !== null) {
      measurements[measurementKey] = parsedValue
    }
  }

  const { error } = await supabase.from('clients').insert({
    name,
    phone: optionalString(formData.get('phone')),
    measurements,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/clients')
  return { ok: true }
}

export async function updateMeasurements(
  clientId: string,
  measurements: MeasurementMap
) {
  const supabase = createClient()

  const { error } = await supabase
    .from('clients')
    .update({ measurements })
    .eq('id', clientId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/clients')
  return { ok: true }
}

export async function createOrder(formData: FormData) {
  const supabase = createClient()
  const clientId = optionalString(formData.get('client_id'))

  if (!clientId) {
    return { error: 'Client is required.' }
  }

  const { error } = await supabase.from('orders').insert({
    client_id: clientId,
    garment_type: optionalString(formData.get('garment_type')),
    status: optionalString(formData.get('status')) ?? 'pending',
    yards_required: optionalNumber(formData.get('yards_required')),
    delivery_estimate: optionalString(formData.get('delivery_estimate')),
    image_url: optionalString(formData.get('image_url')),
    notes: optionalString(formData.get('notes')),
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/clients')
  return { ok: true }
}
