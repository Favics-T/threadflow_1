import { createClient } from './server'
import { mockOrders, mockTailorAssignments, mockTailors, mockMessages } from '@/lib/mock-data'
import type { Order, OrderStatus, OrderType, Message, Tailor } from '@/types/threadflow'

export type BoardOrderMessage = Pick<Message, 'id' | 'source' | 'client_contact' | 'content'>

export type BoardOrderAssignment = {
  assignmentId: string
  tailorId: string
  tailorName: string
  specialty: string | null
  roleDescription: string | null
  approvedByTailor: boolean
  editedByTailor: boolean
  assignedAt: string
}

export type BoardOrder = Order & {
  message: BoardOrderMessage | null
  assignment: BoardOrderAssignment | null
}

type SupabaseRelation<T> = T | T[] | null

function firstRelation<T>(relation: SupabaseRelation<T>): T | null {
  return Array.isArray(relation) ? relation[0] ?? null : relation
}

type OrderRow = Order & {
  messages: SupabaseRelation<BoardOrderMessage>
  tailor_assignments: {
    id: string
    tailor_id: string
    role_description: string | null
    approved_by_tailor: boolean
    edited_by_tailor: boolean
    assigned_at: string
    tailors: SupabaseRelation<Pick<Tailor, 'id' | 'name' | 'specialty'>>
  }[]
}

const ORDER_SELECT = `
  *,
  messages ( id, source, client_contact, content ),
  tailor_assignments (
    id,
    tailor_id,
    role_description,
    approved_by_tailor,
    edited_by_tailor,
    assigned_at,
    tailors ( id, name, specialty )
  )
`

function normalizeOrder(row: OrderRow): BoardOrder {
  const message = firstRelation(row.messages)
  const [assignmentRow] = row.tailor_assignments ?? []
  const tailor = assignmentRow ? firstRelation(assignmentRow.tailors) : null

  return {
    ...row,
    message: message ?? null,
    assignment:
      assignmentRow && tailor
        ? {
            assignmentId: assignmentRow.id,
            tailorId: assignmentRow.tailor_id,
            tailorName: tailor.name,
            specialty: tailor.specialty,
            roleDescription: assignmentRow.role_description,
            approvedByTailor: assignmentRow.approved_by_tailor,
            editedByTailor: assignmentRow.edited_by_tailor,
            assignedAt: assignmentRow.assigned_at,
          }
        : null,
  }
}

export async function getOrders(): Promise<{ data: BoardOrder[] | null; error: string | null }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .order('deadline', { ascending: true })

  if (error || !data) {
    return { data: null, error: error?.message ?? 'No data returned' }
  }

  return { data: (data as unknown as OrderRow[]).map(normalizeOrder), error: null }
}

export async function getOrderById(id: string): Promise<{ data: BoardOrder | null; error: string | null }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('id', id)
    .single()

  if (error || !data) {
    return { data: null, error: error?.message ?? 'Order not found' }
  }

  return { data: normalizeOrder(data as unknown as OrderRow), error: null }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  return { error: error?.message ?? null }
}

export async function createOrder(input: {
  messageId: string | null
  clientName: string
  clothType: string
  description: string | null
  deadline: string
  orderType: OrderType
  status?: OrderStatus
  collectionId?: string | null
}): Promise<{ data: Order | null; error: string | null }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .insert({
      message_id: input.messageId,
      client_name: input.clientName,
      cloth_type: input.clothType,
      description: input.description,
      deadline: input.deadline,
      order_type: input.orderType,
      status: input.status ?? 'confirmed',
      collection_id: input.collectionId ?? null,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as Order, error: null }
}

export function getMockOrders(): BoardOrder[] {
  return mockOrders.map((order) => {
    const message = order.message_id ? mockMessages.find((m) => m.id === order.message_id) ?? null : null
    const assignmentRow = mockTailorAssignments.find((a) => a.order_id === order.id)
    const tailor = assignmentRow ? mockTailors.find((t) => t.id === assignmentRow.tailor_id) ?? null : null

    return {
      ...order,
      message: message
        ? { id: message.id, source: message.source, client_contact: message.client_contact, content: message.content }
        : null,
      assignment:
        assignmentRow && tailor
          ? {
              assignmentId: assignmentRow.id,
              tailorId: assignmentRow.tailor_id,
              tailorName: tailor.name,
              specialty: tailor.specialty,
              roleDescription: assignmentRow.role_description,
              approvedByTailor: assignmentRow.approved_by_tailor,
              editedByTailor: assignmentRow.edited_by_tailor,
              assignedAt: assignmentRow.assigned_at,
            }
          : null,
    }
  })
}
