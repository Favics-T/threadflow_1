// ── Conversation Pipeline Types ──────────────────────────────────────────────

export type ConversationPlatform = 'instagram' | 'whatsapp' | 'website' | 'facebook'
export type ConversationPriority = 'high' | 'normal' | 'low'

export type ProductionStatus =
  | 'pending_confirmation' // tailor hasn't confirmed yet
  | 'confirmed'            // tailor confirmed, awaiting workforce assignment
  | 'assigned'             // tailor assigned by AI, awaiting owner approval
  | 'in_production'
  | 'quality_control'
  | 'ready_for_delivery'
  | 'delivered'

// ── Inbox Stage 1: No Response ────────────────────────────────────────────────
export interface NoResponseMessage {
  id: string
  clientName: string
  platform: ConversationPlatform
  message: string
  timestamp: string
  priority: ConversationPriority
}

// ── Inbox Stage 2: Pending ────────────────────────────────────────────────────
// Conversation active but delivery date not yet confirmed
export interface PendingConversation {
  id: string
  clientName: string
  platform: ConversationPlatform
  summary: string
  collectedInfo: string[]
  missingInfo: string[]
  lastMessageAt: string
}

// ── Inbox Stage 3: Done ───────────────────────────────────────────────────────
// Conversation concluded — delivery date confirmed — pushes to Orders
export interface DoneConversation {
  id: string
  clientName: string
  platform: ConversationPlatform
  garmentDescription: string
  agreedDeliveryDate: string
  concludedAt: string
  pushedToOrders: boolean
}

// ── Orders Page ───────────────────────────────────────────────────────────────
export interface ProductionOrder {
  id: string
  clientName: string
  garmentDescription: string
  agreedDeliveryDate: string
  productionStatus: ProductionStatus
  tailorName?: string          // set after workforce assignment approved
  conversationId: string       // link back to inbox
  platform: ConversationPlatform
  rejectedAt?: string          // set if tailor rejects — goes back to Pending
}

// ── Workforce Assignment ──────────────────────────────────────────────────────
export interface TailorAssignment {
  id: string
  tailorId: string
  tailorName: string
  orderId: string
  clientName: string
  garmentDescription: string
  suggestedByAI: boolean
  approvedByOwner: boolean
  assignedAt: string
  completedAt?: string
}

// ── AI Draft Result ───────────────────────────────────────────────────────────
export interface DraftResult {
  draft_message: string
  delivery_estimate: string
  estimate_status: 'on_track' | 'at_risk' | 'blocked'
  reasoning: string[]
}