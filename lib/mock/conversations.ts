// ── Mock Conversations Data ───────────────────────────────────────────────────
// Realistic seed data mirroring the shape of the future `conversations` Supabase
// table. Replace these imports with live Supabase queries when the table is ready.

import type {
  UnrespondedMessage,
  ConversationInProgress,
  FinalizedOrder,
} from '@/lib/types/conversations'

// ── Stage 1: Unresponded Messages (5 entries) ─────────────────────────────────
export const mockUnrespondedMessages: UnrespondedMessage[] = [
  {
    id: 'conv-u-001',
    clientName: 'Kemi Adeleke',
    platform: 'instagram',
    message:
      'Hi! I saw your post about the ankara collections. I need a custom gown for my wedding in December, can we discuss pricing and timeline?',
    timestamp: '8 min ago',
    priority: 'high',
  },
  {
    id: 'conv-u-002',
    clientName: 'Ngozi Obi',
    platform: 'website',
    message:
      'Order submitted via website booking form. Requests a fitted blazer suit for a corporate dinner event on the 15th of July.',
    timestamp: '23 min ago',
    priority: 'normal',
  },
  {
    id: 'conv-u-003',
    clientName: 'Fatima Al-Hassan',
    platform: 'whatsapp',
    message:
      "Good morning! I need a kaftan for my daughter's naming ceremony next weekend. She is a size 14. What fabrics do you have available?",
    timestamp: '1 hr ago',
    priority: 'high',
  },
  {
    id: 'conv-u-004',
    clientName: 'Chioma Eze',
    platform: 'facebook',
    message:
      'Saw the pictures from your last collection - absolutely stunning! Do you take walk-in clients or strictly by appointment?',
    timestamp: '2 hrs ago',
    priority: 'low',
  },
  {
    id: 'conv-u-005',
    clientName: 'Amara Nwosu',
    platform: 'instagram',
    message:
      'Hello, I want to place an order for bridesmaids dresses (6 ladies). Can you handle bulk orders? My wedding is in March.',
    timestamp: '3 hrs ago',
    priority: 'high',
  },
]

// ── Stage 2: Communication In Progress (3 entries) ────────────────────────────
export const mockConversationsInProgress: ConversationInProgress[] = [
  {
    id: 'conv-p-001',
    clientName: 'Adaeze Okonkwo',
    summary:
      "Client wants an aso-ebi lace gown for her sister's wedding. Budget confirmed at N85,000. Finalising measurements and fabric colour.",
    collectedInfo: ['Event Date (Aug 12)', 'Garment Type (Lace gown)', 'Budget (N85,000)'],
    missingInfo: ['Measurements', 'Fabric Colour Choice'],
  },
  {
    id: 'conv-p-002',
    clientName: 'Blessing Taiwo',
    summary:
      'Corporate client requesting 3 pieces - two blazer suits and one evening dress. Exploring premium suiting fabric options.',
    collectedInfo: ['Garment Types (2 suits, 1 gown)', 'Company Name', 'Preferred Colour Palette'],
    missingInfo: ['Measurements (all 3)', 'Deadline', 'Budget Approval'],
  },
  {
    id: 'conv-p-003',
    clientName: 'Yetunde Balogun',
    summary:
      'Repeat client ordering a custom agbada set for her husband. Measurements on file from last order. Waiting on delivery date confirmation.',
    collectedInfo: ['Garment Type (Agbada)', 'Fabric Choice (White guinea brocade)', 'Measurements (on file)'],
    missingInfo: ['Agreed Delivery Date'],
  },
]

// ── Stage 3: Finalized Orders (7 entries) ─────────────────────────────────────
export const mockFinalizedOrders: FinalizedOrder[] = [
  {
    id: 'conv-f-001',
    clientName: 'Kelechi Uba',
    garmentType: 'Ankara Maxi Dress',
    agreedDeliveryDate: 'Jul 5, 2026',
    productionStatus: 'in_production',
  },
  {
    id: 'conv-f-002',
    clientName: 'Sade Ogundimu',
    garmentType: 'Lace Evening Gown',
    agreedDeliveryDate: 'Jul 10, 2026',
    productionStatus: 'quality_control',
  },
  {
    id: 'conv-f-003',
    clientName: 'Ifunanya Musa',
    garmentType: 'Fitted Blazer Suit',
    agreedDeliveryDate: 'Jul 3, 2026',
    productionStatus: 'ready_for_delivery',
  },
  {
    id: 'conv-f-004',
    clientName: 'Tunde Ajayi',
    garmentType: 'Agbada Set (3-piece)',
    agreedDeliveryDate: 'Jul 18, 2026',
    productionStatus: 'assigned',
  },
  {
    id: 'conv-f-005',
    clientName: 'Miriam Okafor',
    garmentType: 'Bridesmaids Dress x4',
    agreedDeliveryDate: 'Aug 2, 2026',
    productionStatus: 'unassigned',
  },
  {
    id: 'conv-f-006',
    clientName: 'Chiamaka Nnaji',
    garmentType: 'Kaftan & Gele Set',
    agreedDeliveryDate: 'Jun 28, 2026',
    productionStatus: 'delivered',
  },
  {
    id: 'conv-f-007',
    clientName: 'Remi Fashola',
    garmentType: 'Corporate Shirt x5',
    agreedDeliveryDate: 'Jul 14, 2026',
    productionStatus: 'in_production',
  },
]
