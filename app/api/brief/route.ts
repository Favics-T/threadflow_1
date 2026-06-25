import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { buildBriefPrompt, type BriefSnapshot } from '@/lib/brief'

const SYSTEM_PROMPT = `You are a smart operations assistant for a Nigerian fashion house. Generate a clear, friendly Monday morning briefing. Structure it as: 1) Quick summary sentence 2) Urgent attention needed (AT_RISK items) 3) What's in production this week 4) Inbox status 5) One motivational closing line. Use a warm, professional tone. Be specific with names and dates.`

export async function POST(req: Request) {
  const snapshot = (await req.json().catch(() => null)) as BriefSnapshot | null

  if (!snapshot) {
    return new Response('A studio snapshot is required.', { status: 400 })
  }

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: SYSTEM_PROMPT,
    prompt: buildBriefPrompt(snapshot),
  })

  return result.toTextStreamResponse()
}
