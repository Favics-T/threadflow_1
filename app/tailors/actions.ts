'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { updateOrderStatus } from '@/lib/supabase/orders'

export async function toggleTailorAvailability(tailorId: string, isAvailable: boolean) {
  const supabase = createClient()
  const { error } = await supabase
    .from('tailors')
    .update({ is_available: isAvailable })
    .eq('id', tailorId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/tailors')
  return { ok: true }
}

export async function approveAssignment(assignmentId: string, approved: boolean) {
  const supabase = createClient()
  const { error } = await supabase
    .from('tailor_assignments')
    .update({ approved_by_tailor: approved })
    .eq('id', assignmentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/tailors')
  return { ok: true }
}

export async function updateAssignmentRole(assignmentId: string, roleDescription: string) {
  const text = roleDescription.trim()

  if (!text) {
    return { error: 'Role description cannot be empty.' }
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('tailor_assignments')
    .update({ role_description: text, edited_by_tailor: true })
    .eq('id', assignmentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/tailors')
  return { ok: true }
}

export type CreatedAssignment = {
  id: string
  order_id: string
  tailor_id: string
  role_description: string | null
  reasoning: string | null
  approved_by_tailor: boolean
  edited_by_tailor: boolean
  assigned_at: string
}

export async function createManualAssignment(input: {
  orderId: string
  tailorId: string
  roleDescription: string
}): Promise<{ data: CreatedAssignment | null; error: string | null }> {
  const roleDescription = input.roleDescription.trim()

  if (!roleDescription) {
    return { data: null, error: 'Role description is required.' }
  }

  const supabase = createClient()
  const { data, error: assignmentError } = await supabase
    .from('tailor_assignments')
    .insert({
      order_id: input.orderId,
      tailor_id: input.tailorId,
      role_description: roleDescription,
      reasoning: 'Manually assigned by the shop.',
      approved_by_tailor: false,
      edited_by_tailor: false,
    })
    .select()
    .single()

  if (assignmentError) {
    return { data: null, error: assignmentError.message }
  }

  const { error: statusError } = await updateOrderStatus(input.orderId, 'in_production')

  if (statusError) {
    return { data: null, error: statusError }
  }

  revalidatePath('/tailors')
  revalidatePath('/orders')
  return { data: data as CreatedAssignment, error: null }
}

export async function confirmAutoAssignments(
  suggestions: { orderId: string; tailorId: string; roleDescription: string; reasoning: string }[]
): Promise<{ data: CreatedAssignment[] | null; error: string | null }> {
  if (suggestions.length === 0) {
    return { data: null, error: 'No suggestions to apply.' }
  }

  const supabase = createClient()
  const { data, error: assignmentError } = await supabase
    .from('tailor_assignments')
    .insert(
      suggestions.map((s) => ({
        order_id: s.orderId,
        tailor_id: s.tailorId,
        role_description: s.roleDescription,
        reasoning: s.reasoning,
        approved_by_tailor: false,
        edited_by_tailor: false,
      }))
    )
    .select()

  if (assignmentError) {
    return { data: null, error: assignmentError.message }
  }

  for (const suggestion of suggestions) {
    const { error: statusError } = await updateOrderStatus(suggestion.orderId, 'in_production')
    if (statusError) {
      return { data: null, error: statusError }
    }
  }

  revalidatePath('/tailors')
  revalidatePath('/orders')
  return { data: data as CreatedAssignment[], error: null }
}
