import { anthropic } from '@ai-sdk/anthropic'
import { generateText, tool, stepCountIs } from 'ai'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { flagLowStock } from '@/lib/tools/flagLowStock'
import { getTailorWorkload } from '@/lib/tools/get-tailor-workload'
import { getOrderStatus } from '@/lib/tools/get-order-status'
import { checkFabricStock } from '@/lib/tools/check-fabric-stock'

export async function GET() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const result = await generateText({
    model: anthropic('claude-sonnet-4-6'),
    system: `You are ThreadFlow, an AI operations agent for a fashion house studio.
Your job right now is to generate the Morning Brief — a prioritized daily summary
for the studio manager.

Structure your brief exactly like this:
1. Open with one sentence on overall studio health
2. List urgent decisions (fabric issues, blocked orders, overloaded tailors)
3. List recommended actions with clear reasoning for each
4. Close with one forward-looking note

Be specific — name clients, tailors, fabrics. Be concise — this is a brief, not a report.
The manager reads this in 60 seconds and knows exactly what to do today.`,
    prompt: `Generate the morning brief for ${today}. 
Check fabric stock levels, tailor workloads, and any blocked or at-risk orders.
Surface the top decisions the manager needs to make today with your reasoning.`,
    tools: {
      flag_low_stock: tool({
        description: 'Scan fabric inventory for low stock items',
        inputSchema: z.object({
          thresholdYards: z.number().describe('Threshold — use 5'),
        }),
        execute: async ({ thresholdYards }) => flagLowStock(thresholdYards ?? 5),
      }),
      get_tailor_workload: tool({
        description: 'Get all tailor workloads',
        inputSchema: z.object({
          _placeholder: z.string().optional(),
        }),
        execute: async () => getTailorWorkload(),
      }),
      check_fabric_stock: tool({
        description: 'Check a specific fabric stock level',
        inputSchema: z.object({
          materialName: z.string(),
        }),
        execute: async ({ materialName }) => checkFabricStock(materialName),
      }),
    },
    stopWhen: stepCountIs(4),
  })

  const toolsCalled = result.steps
    .flatMap((s) => s.toolCalls ?? [])
    .map((t) => t.toolName)

  return NextResponse.json({
    brief: result.text,
    date: today,
    toolsCalled,
  })
}