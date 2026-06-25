'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { OrderType } from '@/types/threadflow'

export async function approveAndSend(messageId: string, draftText: string) {
  const text = draftText.trim()

  if (!text) {
    return { error: 'Draft cannot be empty.' }
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('messages')
    .update({
      status: 'responded',
      ai_draft: text,
      approved_at: new Date().toISOString(),
    })
    .eq('id', messageId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/inbox')
  return { ok: true }
}

export async function finalizeOrder(input: {
  messageId: string
  clientName: string
  clothType: string
  description: string
  deadline: string
  orderType: OrderType
}) {
  const supabase = createClient()

  const { error: orderError } = await supabase.from('orders').insert({
    message_id: input.messageId,
    client_name: input.clientName,
    cloth_type: input.clothType,
    description: input.description || null,
    deadline: input.deadline,
    order_type: input.orderType,
    status: 'confirmed',
  })

  if (orderError) {
    return { error: orderError.message }
  }

  const { error: messageError } = await supabase
    .from('messages')
    .update({ status: 'finalized' })
    .eq('id', input.messageId)

  if (messageError) {
    return { error: messageError.message }
  }

  revalidatePath('/inbox')
  return { ok: true }
}
