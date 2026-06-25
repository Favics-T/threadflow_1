import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

const BUSINESS_NAME = process.env.BUSINESS_NAME || 'ThreadFlow'

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}))
  const message = typeof payload?.message === 'string' ? payload.message.trim() : ''

  if (!message) {
    return NextResponse.json({ error: 'A client message is required.' }, { status: 400 })
  }

  try {
    const result = await generateText({
      model: google('gemini-2.0-flash'),
      system: `You are a professional assistant for a Nigerian fashion house called ${BUSINESS_NAME}. Write a warm, professional WhatsApp-style response to this client message. Be concise, friendly, address their specific request, and end with a clear next step. Use Nigerian English tone — not overly formal.`,
      prompt: message,
    })

    return NextResponse.json({ draft: result.text })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate draft' },
      { status: 500 }
    )
  }
}
