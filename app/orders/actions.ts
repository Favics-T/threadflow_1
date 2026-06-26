'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function confirmOrder(orderId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('orders')
    .update({ tailor_confirmed: true })
    .eq('id', orderId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/orders')
  revalidatePath('/tailors')
  return { ok: true }
}
