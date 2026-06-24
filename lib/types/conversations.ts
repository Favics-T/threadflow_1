// ── Conversation Pipeline Types ──────────────────────────────────────────────
// Represents the first three stages of the ThreadFlow order pipeline:
//   Unresponded Messages → Communication In Progress → Finalized Orders

export type ConversationPlatform = 'instagram' | 'whatsapp' | 'website' | 'facebook'
export type ConversationPriority = 'high' | 'normal' | 'low'

export type ProductionStatus =
  | 'unassigned'
  | 'assigned'
  | 'in_production'
  | 'quality_control'
  | 'ready_for_delivery'
  | 'delivered'

// ── Stage 1: Unresponded Messages ────────────────────────────────────────────
// Inquiries that have received zero replies from the studio.
export interface UnrespondedMessage {
  id: string
  clientName: string
  platform: ConversationPlatform
  message: string
  /** Human-readable elapsed time, e.g. "8 min ago" */
  timestamp: string
  priority: ConversationPriority
}

// ── Stage 2: Communication In Progress ───────────────────────────────────────
// Conversations actively being discussed; order not yet confirmed.
export interface ConversationInProgress {
  id: string
  clientName: string
  /** One-line AI or manual summary of conversation so far */
  summary: string
  /** Details already confirmed by the client */
  collectedInfo: string[]
  /** Details still needed before the order can be finalised */
  missingInfo: string[]
}

// ── Stage 3: Finalized Orders ─────────────────────────────────────────────────
// Confirmed production orders waiting to be assigned or currently in production.
export interface FinalizedOrder {
  id: string
  clientName: string
  garmentType: string
  /** ISO date string or human-readable date */
  agreedDeliveryDate: string
  productionStatus: ProductionStatus
}

// ── AI Draft Result (reused from IncomingOrders pattern) ─────────────────────
export interface DraftResult {
  draft_message: string
  delivery_estimate: string
  estimate_status: 'on_track' | 'at_risk' | 'blocked'
  reasoning: string[]
}
