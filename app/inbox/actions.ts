'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createOrder, getOrderByMessageId, getOrders, updateOrderStatus, withLiveTailorLoad } from '@/lib/supabase/orders'
import { assignTailorsToOrders, type AssignmentSuggestion } from '@/lib/assignment-engine'
import type { OrderType, Tailor } from '@/types/threadflow'

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
  collectionId: string | null
}) {
  const { error: orderError } = await createOrder({
    messageId: input.messageId,
    clientName: input.clientName,
    clothType: input.clothType,
    description: input.description || null,
    deadline: input.deadline,
    orderType: input.orderType,
    collectionId: input.collectionId,
  })

  if (orderError) {
    return { error: orderError }
  }

  const supabase = createClient()
  const { error: messageError } = await supabase
    .from('messages')
    .update({ status: 'pending_approval' })
    .eq('id', input.messageId)

  if (messageError) {
    return { error: messageError.message }
  }

  revalidatePath('/inbox')
  revalidatePath('/orders')
  revalidatePath('/collections')
  return { ok: true }
}

export async function getOrderForMessage(messageId: string) {
  const { data, error } = await getOrderByMessageId(messageId)
  return { order: data, error }
}

/**
 * The tailor's explicit sign-off that a drafted order is real. Flips
 * tailor_confirmed (the same gate the Orders board's "CONFIRM ORDER" button
 * uses), marks the message finalized, and immediately runs the assignment
 * engine so a suggested tailor — with reasoning — is ready for one-click
 * confirmation instead of requiring a separate trip to the Tailors page.
 */
export async function approveOrder(messageId: string): Promise<{
  ok: boolean
  error?: string
  suggestion?: AssignmentSuggestion
}> {
  const { data: order, error: orderError } = await getOrderByMessageId(messageId)

  if (orderError || !order) {
    return { ok: false, error: orderError ?? 'No draft order found for this message.' }
  }

  const supabase = createClient()

  const { error: orderUpdateError } = await supabase
    .from('orders')
    .update({ tailor_confirmed: true })
    .eq('id', order.id)

  if (orderUpdateError) {
    return { ok: false, error: orderUpdateError.message }
  }

  const { error: messageError } = await supabase
    .from('messages')
    .update({ status: 'finalized' })
    .eq('id', messageId)

  if (messageError) {
    return { ok: false, error: messageError.message }
  }

  const { data: tailorsData, error: tailorsError } = await supabase
    .from('tailors')
    .select('id, name, specialty, current_load, is_available')

  if (tailorsError) {
    return { ok: false, error: tailorsError.message }
  }

  const { data: ordersData, error: ordersError } = await getOrders()

  if (ordersError || !ordersData) {
    return { ok: false, error: ordersError ?? 'Could not load orders for assignment.' }
  }

  const liveTailors = withLiveTailorLoad(tailorsData as Tailor[], ordersData)
  const updatedOrders = ordersData.map((o) => (o.id === order.id ? { ...o, tailor_confirmed: true } : o))
  const suggestions = assignTailorsToOrders(updatedOrders, liveTailors)
  const suggestion = suggestions.find((s) => s.orderId === order.id)

  revalidatePath('/inbox')
  revalidatePath('/orders')
  return { ok: true, suggestion }
}

export async function confirmSuggestedAssignment(input: {
  orderId: string
  tailorId: string
  roleDescription: string
  reasoning: string
}): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createClient()

  const { data, error: assignmentError } = await supabase
    .from('tailor_assignments')
    .insert({
      order_id: input.orderId,
      tailor_id: input.tailorId,
      role_description: input.roleDescription,
      reasoning: input.reasoning,
      approved_by_tailor: false,
      edited_by_tailor: false,
    })
    .select('id')
    .single()

  if (assignmentError) {
    return { data: null, error: assignmentError.message }
  }

  const { error: statusError } = await updateOrderStatus(input.orderId, 'in_production')

  if (statusError) {
    return { data: null, error: statusError }
  }

  revalidatePath('/inbox')
  revalidatePath('/orders')
  revalidatePath('/tailors')
  return { data: data as { id: string }, error: null }
}
