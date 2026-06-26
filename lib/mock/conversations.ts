import type {
  NoResponseMessage,
  PendingConversation,
  DoneConversation,
  ProductionOrder,
  TailorAssignment,
  StaffMember,
  AgentAssignmentStatus,
  AgentAssignment
} from '@/lib/types/conversations'

// Stage 1: No Response 
export const mockNoResponseMessages: NoResponseMessage[] = [
  {
    id: 'conv-nr-001',
    clientName: 'Kemi Adeleke',
    platform: 'instagram',
    message:
      'Hi! I saw your post about the ankara collections. I need a custom gown for my wedding in December, can we discuss pricing and timeline?',
    timestamp: '8 min ago',
    priority: 'high',
  },
  {
    id: 'conv-nr-002',
    clientName: 'Ngozi Obi',
    platform: 'website',
    message:
      'Order submitted via website booking form. Requests a fitted blazer suit for a corporate dinner event on the 15th of July.',
    timestamp: '23 min ago',
    priority: 'normal',
  },
  {
    id: 'conv-nr-003',
    clientName: 'Fatima Al-Hassan',
    platform: 'whatsapp',
    message:
      "Good morning! I need a kaftan for my daughter's naming ceremony next weekend. She is a size 14. What fabrics do you have available?",
    timestamp: '1 hr ago',
    priority: 'high',
  },
  {
    id: 'conv-nr-004',
    clientName: 'Chioma Eze',
    platform: 'facebook',
    message:
      'Saw the pictures from your last collection — absolutely stunning! Do you take walk-in clients or strictly by appointment?',
    timestamp: '2 hrs ago',
    priority: 'low',
  },
]

// Stage 2: Pending 
export const mockPendingConversations: PendingConversation[] = [
  {
    id: 'conv-p-001',
    clientName: 'Adaeze Okonkwo',
    platform: 'instagram',
    summary:
      "Client wants an aso-ebi lace gown for her sister's wedding. Budget confirmed at ₦85,000. Finalising measurements and fabric colour.",
    collectedInfo: ['Event Date (Aug 12)', 'Garment Type (Lace gown)', 'Budget (₦85,000)'],
    missingInfo: ['Measurements', 'Fabric Colour Choice'],
    lastMessageAt: '35 min ago',
  },
  {
    id: 'conv-p-002',
    clientName: 'Blessing Taiwo',
    platform: 'whatsapp',
    summary:
      'Corporate client requesting 3 pieces — two blazer suits and one evening dress. Exploring premium suiting fabric options.',
    collectedInfo: ['Garment Types (2 suits, 1 gown)', 'Company Name', 'Preferred Colour Palette'],
    missingInfo: ['Measurements (all 3)', 'Deadline', 'Budget Approval'],
    lastMessageAt: '2 hrs ago',
  },
  {
    id: 'conv-p-003',
    clientName: 'Yetunde Balogun',
    platform: 'whatsapp',
    summary:
      'Repeat client ordering a custom agbada set for her husband. Measurements on file. Waiting on delivery date confirmation.',
    collectedInfo: [
      'Garment Type (Agbada)',
      'Fabric Choice (White guinea brocade)',
      'Measurements (on file)',
    ],
    missingInfo: ['Agreed Delivery Date'],
    lastMessageAt: '4 hrs ago',
  },
]

// ── Stage 3: Done ─────────────────────────────────────────────────────────────
export const mockDoneConversations: DoneConversation[] = [
  {
    id: 'conv-d-001',
    clientName: 'Kelechi Uba',
    platform: 'instagram',
    garmentDescription: 'Ankara Maxi Dress — burgundy & gold, size 12, midi length',
    agreedDeliveryDate: 'Jul 5, 2026',
    concludedAt: 'Yesterday, 3:14 PM',
    pushedToOrders: true,
  },
  {
    id: 'conv-d-002',
    clientName: 'Ifunanya Musa',
    platform: 'website',
    garmentDescription: 'Fitted Blazer Suit — navy blue, size 10, single-breasted',
    agreedDeliveryDate: 'Jul 3, 2026',
    concludedAt: 'Yesterday, 11:42 AM',
    pushedToOrders: true,
  },
  {
    id: 'conv-d-003',
    clientName: 'Chiamaka Nnaji',
    platform: 'whatsapp',
    garmentDescription: 'Kaftan & Gele Set — royal blue george fabric, size 16',
    agreedDeliveryDate: 'Jun 28, 2026',
    concludedAt: '2 days ago',
    pushedToOrders: true,
  },
]

// ── Production Orders (shown on /orders) ─────────────────────────────────────
export const mockProductionOrders: ProductionOrder[] = [
  {
    id: 'ord-001',
    clientName: 'Kelechi Uba',
    garmentDescription: 'Ankara Maxi Dress — burgundy & gold, size 12, midi length',
    agreedDeliveryDate: 'Jul 5, 2026',
    productionStatus: 'in_production',
    tailorName: 'Emeka Osei',
    conversationId: 'conv-d-001',
    platform: 'instagram',
  },
  {
    id: 'ord-002',
    clientName: 'Sade Ogundimu',
    garmentDescription: 'Lace Evening Gown — champagne, size 8, floor-length with train',
    agreedDeliveryDate: 'Jul 10, 2026',
    productionStatus: 'quality_control',
    tailorName: 'Amaka Eze',
    conversationId: 'conv-d-004',
    platform: 'facebook',
  },
  {
    id: 'ord-003',
    clientName: 'Ifunanya Musa',
    garmentDescription: 'Fitted Blazer Suit — navy blue, size 10, single-breasted',
    agreedDeliveryDate: 'Jul 3, 2026',
    productionStatus: 'pending_confirmation',
    conversationId: 'conv-d-002',
    platform: 'website',
  },
  {
    id: 'ord-004',
    clientName: 'Tunde Ajayi',
    garmentDescription: 'Agbada Set (3-piece) — white & gold embroidery, size XL',
    agreedDeliveryDate: 'Jul 18, 2026',
    productionStatus: 'confirmed',
    conversationId: 'conv-d-005',
    platform: 'whatsapp',
  },
  {
    id: 'ord-005',
    clientName: 'Miriam Okafor',
    garmentDescription: 'Bridesmaids Dress x4 — dusty rose, sizes 10/12/14/16',
    agreedDeliveryDate: 'Aug 2, 2026',
    productionStatus: 'pending_confirmation',
    conversationId: 'conv-d-006',
    platform: 'instagram',
  },
  {
    id: 'ord-006',
    clientName: 'Chiamaka Nnaji',
    garmentDescription: 'Kaftan & Gele Set — royal blue george fabric, size 16',
    agreedDeliveryDate: 'Jun 28, 2026',
    productionStatus: 'ready_for_delivery',
    tailorName: 'Emeka Osei',
    conversationId: 'conv-d-003',
    platform: 'whatsapp',
  },
  {
    id: 'ord-007',
    clientName: 'Remi Fashola',
    garmentDescription: 'Corporate Shirt x5 — white poplin, various sizes',
    agreedDeliveryDate: 'Jul 14, 2026',
    productionStatus: 'assigned',
    tailorName: 'Chidinma Adeyemi',
    conversationId: 'conv-d-007',
    platform: 'whatsapp',
  },
]

// ── Past Assignments (shown on /workforce history) ────────────────────────────
export const mockPastAssignments: TailorAssignment[] = [
  {
    id: 'asgn-001',
    tailorId: 't-1',
    tailorName: 'Emeka Osei',
    orderId: 'ord-hist-001',
    clientName: 'Funmi Balogun',
    garmentDescription: 'Wedding gown — ivory lace, floor length',
    suggestedByAI: true,
    approvedByOwner: true,
    assignedAt: 'Jun 2, 2026',
    completedAt: 'Jun 18, 2026',
  },
  {
    id: 'asgn-002',
    tailorId: 't-2',
    tailorName: 'Amaka Eze',
    orderId: 'ord-hist-002',
    clientName: 'Tolu Adeyemi',
    garmentDescription: 'Ankara two-piece set',
    suggestedByAI: true,
    approvedByOwner: true,
    assignedAt: 'Jun 5, 2026',
    completedAt: 'Jun 12, 2026',
  },
  {
    id: 'asgn-003',
    tailorId: 't-1',
    tailorName: 'Emeka Osei',
    orderId: 'ord-hist-003',
    clientName: 'Grace Nwosu',
    garmentDescription: 'Corporate blazer suit x2',
    suggestedByAI: false,
    approvedByOwner: true,
    assignedAt: 'May 20, 2026',
    completedAt: 'Jun 1, 2026',
  },
  {
    id: 'asgn-004',
    tailorId: 't-3',
    tailorName: 'Chidinma Adeyemi',
    orderId: 'ord-hist-004',
    clientName: 'Nneka Obi',
    garmentDescription: 'Aso-ebi lace gown',
    suggestedByAI: true,
    approvedByOwner: true,
    assignedAt: 'May 15, 2026',
    completedAt: 'May 28, 2026',
  },
  {
    id: 'asgn-005',
    tailorId: 't-2',
    tailorName: 'Amaka Eze',
    orderId: 'ord-hist-005',
    clientName: 'Jumoke Ade',
    garmentDescription: 'Bridesmaids dresses x3',
    suggestedByAI: true,
    approvedByOwner: true,
    assignedAt: 'Apr 28, 2026',
    completedAt: 'May 14, 2026',
  },
  {
    id: 'asgn-006',
    tailorId: 't-3',
    tailorName: 'Chidinma Adeyemi',
    orderId: 'ord-hist-006',
    clientName: 'Bisi Okonkwo',
    garmentDescription: 'Kaftan set — adire fabric',
    suggestedByAI: false,
    approvedByOwner: true,
    assignedAt: 'Apr 10, 2026',
    completedAt: 'Apr 22, 2026',
  },
]

export const mockAgentAssignments: AgentAssignment[] = [
  {
    id: 'agent-001',

    orderId: 'ord-004',

    clientName: 'Tunde Ajayi',

    garmentDescription:
      'Agbada Set (3-piece) — white & gold embroidery, size XL',

    tailorId: 't-1',

    tailorName: 'Emeka Osei',

    agreedDeliveryDate: 'Jul 18, 2026',

    expectedFinishDate: 'Jul 13, 2026',

    reasoning: [
      'Has completed 14 agbada projects successfully',
      'Current workload is below team average',
      'Can finish 5 days before delivery deadline',
      'Previous customer rating: 4.9/5',
    ],

    status: 'pending_tailor_approval',

    suggestedAt: '15 mins ago',
  },

  {
    id: 'agent-002',

    orderId: 'ord-005',

    clientName: 'Miriam Okafor',

    garmentDescription:
      'Bridesmaids Dress x4 — dusty rose, sizes 10/12/14/16',

    tailorId: 't-2',

    tailorName: 'Amaka Eze',

    agreedDeliveryDate: 'Aug 2, 2026',

    expectedFinishDate: 'Jul 28, 2026',

    reasoning: [
      'Specialises in bridal and group outfits',
      'Successfully completed 8 bridesmaid orders',
      'Available production capacity this week',
      'Strong on-time delivery history',
    ],

    status: 'approved',

    suggestedAt: 'Yesterday, 2:14 PM',
  },
] 

export const mockStaff: StaffMember[] = [
  {
    id: 't-1',

    name: 'Emeka Osei',

    role: 'Senior Tailor',

    joinedAt: '12 Jan 2025',

    status: 'active',

    currentLoadHours: 12,

    currentOrders: [
      {
        orderId: 'ord-001',
        clientName: 'Kelechi Uba',
        garment: 'Ankara Maxi Dress',
        dueDate: 'Jul 5, 2026',
      },
      {
        orderId: 'ord-004',
        clientName: 'Tunde Ajayi',
        garment: 'Agbada Set',
        dueDate: 'Jul 18, 2026',
      },
    ],

    completedOrders: 48,

    avgCompletionDays: 6,

    onTimeRate: 97,
  },

  {
    id: 't-2',

    name: 'Amaka Eze',

    role: 'Bridal Specialist',

    joinedAt: '20 Mar 2025',

    status: 'active',

    currentLoadHours: 7,

    currentOrders: [
      {
        orderId: 'ord-002',
        clientName: 'Sade Ogundimu',
        garment: 'Lace Evening Gown',
        dueDate: 'Jul 10, 2026',
      },
    ],

    completedOrders: 34,

    avgCompletionDays: 5,

    onTimeRate: 99,
  },
]