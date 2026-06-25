



export const MOCK_MORNING_BRIEF = {
  brief: `Studio is operational with 7 active orders — 2 require immediate attention.

URGENT:
• Chiamaka Nnaji's Kaftan & Gele Set (due Jun 28) has a fabric shortage. Royal blue george fabric is 2.5 yards short. Order is blocked until restocked or substituted.
• Miriam Okafor's Bridesmaids Dress x4 (due Aug 2) has no tailor assigned. With 4 pieces, production needs to start this week.

TAILOR LOAD:
• Emeka Osei — 14h load (moderate). Currently on Chiamaka's order.
• Amaka Eze — 9h load (moderate). Available for new assignment.
• Chidinma Adeyemi — 6h load (available). Best candidate for Miriam's order.

RECOMMENDED ACTIONS:
1. Flag Chiamaka's fabric shortage to your supplier today — delivery is in 3 days.
2. Assign Chidinma Adeyemi to Miriam Okafor's bridesmaids order immediately.
3. Sade Ogundimu's gown is in quality control — confirm pickup date with client.

This week's output is on track if fabric issue is resolved by EOD today.`,
  date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
  toolsCalled: ['flag_low_stock', 'get_tailor_workload'],
}



export const MOCK_AGENT_RESPONSES: Record<  string,  {
    response: string
    toolsCalled: string[]
    steps: {
      toolCalls?: { tool: string; input: unknown }[]
      toolResults?: { tool: string; result: unknown }[]
    }[]
  }
> = {
  adaeze_delivery: {
    response: `Adaeze Okonkwo's order is on track for delivery by **July 8, 2026**.

Here's what I checked:
- Fabric (Aso-ebi lace) has 8 yards available — 6 yards required. Sufficient.
- Garment complexity: 7 measurements on file. Base production time: 7 days.
- Assigned tailor Emeka Osei is at 14 load hours (moderate). 2-day buffer added.
- Total: 9 days from today → estimated delivery July 8.

No blockers. You can confirm this date with Adaeze.`,
    toolsCalled: ['find_client', 'get_order_status', 'calculate_delivery_estimate'],
    steps: [
      {
        toolCalls: [{ tool: 'find_client', input: { name: 'Adaeze' } }],
        toolResults: [
          {
            tool: 'find_client',
            result: {
              client: {
                id: 'client-adaeze-001',
                name: 'Adaeze Okonkwo',
                phone: '+234 801 234 5678',
                measurements: {
                  bust: 36, waist: 28, hips: 38,
                  shoulder: 15, sleeve: 24, length: 58,
                  neck: 14,
                },
              },
            },
          },
        ],
      },
      {
        toolCalls: [{ tool: 'get_order_status', input: { clientId: 'client-adaeze-001' } }],
        toolResults: [
          {
            tool: 'get_order_status',
            result: {
              orders: [
                {
                  id: 'ord-adaeze-001',
                  status: 'in_progress',
                  yards_required: 6,
                  delivery_estimate: 'Jul 8, 2026',
                  fabric_inventory: { material_name: 'Aso-ebi lace', yards_available: 8 },
                  tailors: { name: 'Emeka Osei', current_load_hours: 14 },
                },
              ],
            },
          },
        ],
      },
      {
        toolCalls: [
          { tool: 'calculate_delivery_estimate', input: { orderId: 'ord-adaeze-001' } },
        ],
        toolResults: [
          {
            tool: 'calculate_delivery_estimate',
            result: {
              status: 'on_track',
              client: 'Adaeze Okonkwo',
              tailor: 'Emeka Osei',
              estimated_delivery: 'July 8, 2026',
              total_days: 9,
              reasoning: [
                'Fabric check: Aso-ebi lace — 8 yards available, 6 required. Sufficient.',
                'Garment complexity: 7 measurements on file. Base production time: 7 days.',
                'Tailor Emeka Osei is at 14 load hours (medium workload). Buffer added: 2 days.',
                'Total estimated days: 9. Target delivery: July 8, 2026.',
              ],
            },
          },
        ],
      },
    ],
  },

  chiamaka_shortage: {
    response: `Chiamaka Nnaji's order is **blocked** due to a fabric shortage.

Royal blue george fabric: only 3.5 yards available, but 6 yards are required. Shortfall of 2.5 yards.

The order cannot proceed to production until this is resolved. I recommend:
1. Contact your fabric supplier today — delivery is due June 28 (3 days away).
2. Consider a fabric substitution if the supplier cannot deliver in time.
3. Notify Chiamaka of a potential delay if restocking takes more than 1 day.`,
    toolsCalled: ['find_client', 'get_order_status', 'check_order_inputs', 'check_fabric_stock'],
    steps: [
      {
        toolCalls: [{ tool: 'find_client', input: { name: 'Chiamaka' } }],
        toolResults: [
          {
            tool: 'find_client',
            result: {
              client: {
                id: 'client-chiamaka-001',
                name: 'Chiamaka Nnaji',
                phone: '+234 803 456 7890',
              },
            },
          },
        ],
      },
      {
        toolCalls: [
          { tool: 'get_order_status', input: { clientId: 'client-chiamaka-001' } },
        ],
        toolResults: [
          {
            tool: 'get_order_status',
            result: {
              orders: [
                {
                  id: 'ord-chiamaka-001',
                  status: 'blocked',
                  yards_required: 6,
                  delivery_estimate: 'Jun 28, 2026',
                  fabric_inventory: {
                    material_name: 'Royal blue george fabric',
                    yards_available: 3.5,
                  },
                  tailors: { name: 'Emeka Osei', current_load_hours: 14 },
                },
              ],
            },
          },
        ],
      },
      {
        toolCalls: [
          {
            tool: 'check_fabric_stock',
            input: { materialName: 'Royal blue george fabric' },
          },
        ],
        toolResults: [
          {
            tool: 'check_fabric_stock',
            result: {
              fabric: {
                id: 'fab-001',
                material_name: 'Royal blue george fabric',
                yards_available: 3.5,
              },
            },
          },
        ],
      },
      {
        toolCalls: [
          {
            tool: 'check_order_inputs',
            input: { orderId: 'ord-chiamaka-001' },
          },
        ],
        toolResults: [
          {
            tool: 'check_order_inputs',
            result: {
              fabric: {
                material_name: 'Royal blue george fabric',
                yards_available: 3.5,
                yards_required: 6,
                sufficient: false,
                shortfall: 2.5,
              },
              status: 'blocked',
            },
          },
        ],
      },
    ],
  },

  tailor_assignment: {
    response: `Based on current workload, I recommend assigning **Chidinma Adeyemi** to Miriam Okafor's bridesmaids order.

Current tailor availability:
- Chidinma Adeyemi — 6h load (available) ✓ Best candidate
- Amaka Eze — 9h load (moderate)
- Emeka Osei — 14h load (moderate, already on 2 orders)

Chidinma has the lowest load and is the only tailor in the available range. With 4 bridesmaids dresses due August 2, starting production this week keeps the order on track.

This assignment is staged for your approval — confirm in the Workforce page.`,
    toolsCalled: ['get_tailor_workload'],
    steps: [
      {
        toolCalls: [{ tool: 'get_tailor_workload', input: { _placeholder: '' } }],
        toolResults: [
          {
            tool: 'get_tailor_workload',
            result: {
              tailors: [
                { id: 't-3', name: 'Chidinma Adeyemi', current_load_hours: 6 },
                { id: 't-2', name: 'Amaka Eze',         current_load_hours: 9 },
                { id: 't-1', name: 'Emeka Osei',        current_load_hours: 14 },
              ],
              lightest: { id: 't-3', name: 'Chidinma Adeyemi', current_load_hours: 6 },
            },
          },
        ],
      },
    ],
  },
}


export const MOCK_DRAFT_REPLY = {
  staged: true,
  approval_required: true,
  client: {
    name: 'Adaeze Okonkwo',
    phone: '+234 801 234 5678',
  },
  order_status: 'in_progress',
  delivery_estimate: 'July 8, 2026',
  estimate_status: 'on_track',
  reasoning: [
    'Fabric check: Aso-ebi lace — 8 yards available, 6 required. Sufficient.',
    'Garment complexity: 7 measurements on file. Base production time: 7 days.',
    'Tailor Emeka Osei is at 14 load hours (medium workload). Buffer added: 2 days.',
    'Total estimated days: 9. Target delivery: July 8, 2026.',
  ],
  draft_message:
    "Hello Adaeze, great news! Your order is on track and we are expecting to have it ready for you by July 8, 2026. We will reach out as soon as it is ready for pickup or delivery. Thank you for choosing us!",
}
