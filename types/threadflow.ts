export type MessageSource = 'instagram' | 'whatsapp' | 'facebook' | 'website'
export type MessageStatus = 'unresponded' | 'responded' | 'finalized'
export type MessageCategory = 'enquiry' | 'negotiation' | 'complaint' | 'order_confirmation'

export interface Message {
  id: string
  source: MessageSource
  client_name: string
  client_contact: string
  content: string
  status: MessageStatus
  category: MessageCategory
  ai_draft: string | null
  approved_at: string | null
  created_at: string
}

export type OrderType = 'bespoke' | 'collection'
export type OrderStatus = 'confirmed' | 'in_production' | 'ready' | 'delivered'

export interface Order {
  id: string
  message_id: string | null
  collection_id: string | null
  client_name: string
  cloth_type: string
  description: string
  deadline: string
  order_type: OrderType
  status: OrderStatus
  tailor_confirmed: boolean
  created_at: string
}

export interface Tailor {
  id: string
  name: string
  specialty: string
  current_load: number
  is_available: boolean
}

export interface TailorAssignment {
  id: string
  order_id: string
  tailor_id: string
  role_description: string
  approved_by_tailor: boolean
  edited_by_tailor: boolean
  assigned_at: string
}

export interface Collection {
  id: string
  name: string
  description: string
  pieces_available: number
  created_at: string
}
