'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createCollection(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()

  if (!name) {
    return { error: 'Collection name is required.' }
  }

  const description = String(formData.get('description') ?? '').trim() || null
  const piecesRaw = String(formData.get('pieces_available') ?? '').trim()
  const piecesAvailable = piecesRaw ? Number(piecesRaw) : 0

  const supabase = createClient()
  const { error } = await supabase.from('collections').insert({
    name,
    description,
    pieces_available: Number.isFinite(piecesAvailable) ? piecesAvailable : 0,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/collections')
  return { ok: true }
}
