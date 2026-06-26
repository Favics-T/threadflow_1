import { NextResponse } from 'next/server'
import { draftClientReply } from '@/lib/tools/draft-client-reply'

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}))
  const { clientName } = payload ?? {}

  const result = await draftClientReply(clientName)

  return NextResponse.json(result)
}
