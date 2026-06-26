import { generateText, stepCountIs, tool } from 'ai'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { findClient } from '@/lib/tools/find-client'
import { getOrderStatus } from '@/lib/tools/get-order-status'
import { checkFabricStock } from '@/lib/tools/check-fabric-stock'
import { reserveMaterial } from '@/lib/tools/reserve-material'
import { flagLowStock } from '@/lib/tools/flagLowStock'
import { getTailorWorkload } from '@/lib/tools/get-tailor-workload'
import { checkOrderInputs } from '@/lib/tools/check-order-input'
import { calculateDeliveryEstimate } from '@/lib/tools/calculate-delivery-estimate'
import { draftClientReply } from '@/lib/tools/draft-client-reply'
import { google } from '@ai-sdk/google'

export async function POST(req: Request) {
  const { message } = await req.json()

  const result = await generateText({
    model: google('gemini-2.0-flash'),
    system: `You are ThreadFlow, an AI operations agent for a fashion house studio.
You have access to tools that let you check fabric stock, find clients, check order status,
calculate delivery estimates, assign tailors, and draft client replies.

When answering, always:
- Use your tools to get real data before responding
- Show your reasoning clearly - tell the manager what you checked and why
- For any client-facing action, always stage it for approval, never say it was sent
- Keep responses concise and action-oriented

You manage: clients, orders, fabric inventory, and tailor workloads.`,
    prompt: message,
    tools: {
      find_client: tool({
        description: 'Find a client by name. Returns client details and measurements.',
        inputSchema: z.object({
          name: z.string().describe('The client name to search for'),
        }),
        execute: async ({ name }) => findClient(name),
      }),

      get_order_status: tool({
        description: 'Get all orders for a client by their client ID.',
        inputSchema: z.object({
          clientId: z.string().describe('The client UUID'),
        }),
        execute: async ({ clientId }) => getOrderStatus(clientId),
      }),

      check_fabric_stock: tool({
        description: 'Check current yardage available for a fabric material.',
        inputSchema: z.object({
          materialName: z.string().describe('The fabric or material name to check'),
        }),
        execute: async ({ materialName }) => checkFabricStock(materialName),
      }),

      reserve_material: tool({
        description: 'Reserve fabric yardage for an order. Deducts from inventory.',
        inputSchema: z.object({
          fabricId: z.string().describe('The fabric UUID'),
          yardsRequired: z.number().describe('How many yards to reserve'),
        }),
        execute: async ({ fabricId, yardsRequired }) =>
          reserveMaterial(fabricId, yardsRequired),
      }),

      flag_low_stock: tool({
        description: 'Scan all fabric inventory and return items below the stock threshold.',
        inputSchema: z.object({
          thresholdYards: z.number().describe('Yards threshold - use 5 as default'),
        }),
        execute: async ({ thresholdYards }) => flagLowStock(thresholdYards ?? 5),
      }),

      get_tailor_workload: tool({
        description: 'Get all tailors and their current workload hours. Returns lightest tailor.',
        inputSchema: z.object({
          _placeholder: z.string().optional().describe('Not used - pass empty string'),
        }),
        execute: async () => getTailorWorkload(),
      }),

      check_order_inputs: tool({
        description: 'Pre-flight check on an order - fabric sufficiency, client measurements, tailor assigned.',
        inputSchema: z.object({
          orderId: z.string().describe('The order UUID'),
        }),
        execute: async ({ orderId }) => checkOrderInputs(orderId),
      }),

      calculate_delivery_estimate: tool({
        description: 'Calculate a delivery estimate for an order with full reasoning chain.',
        inputSchema: z.object({
          orderId: z.string().describe('The order UUID'),
        }),
        execute: async ({ orderId }) => calculateDeliveryEstimate(orderId),
      }),

      draft_client_reply: tool({
        description: 'Draft an approval-gated client status message based on live order data.',
        inputSchema: z.object({
          clientName: z.string().describe('The client name to draft a reply for'),
        }),
        execute: async ({ clientName }) => draftClientReply(clientName),
      }),
    },
    stopWhen: stepCountIs(5),
  })

  // Collect tool calls for the audit trail
  const toolsCalled = result.steps
    .flatMap((s) => s.toolCalls ?? [])
    .map((t) => t.toolName)

  return NextResponse.json({
    response: result.text,
    toolsCalled,
    steps: result.steps.map((s) => ({
      toolCalls: s.toolCalls?.map((t) => ({
        tool: t.toolName,
        input: t.input,
      })),
      toolResults: s.toolResults?.map((r) => ({
        tool: r.toolName,
        result: r.output,
      })),
    })),
  })
}
