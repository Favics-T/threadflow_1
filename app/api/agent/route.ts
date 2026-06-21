import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { message } = await req.json()

  const result = await generateText({
    model: anthropic('claude-sonnet-4-6'),
    system: 'You are ThreadFlow, an AI operations assistant for a fashion house.',
    prompt: message,
  })

  return NextResponse.json({ reply: result.text })
}