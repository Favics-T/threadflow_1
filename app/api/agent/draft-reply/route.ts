import { NextResponse } from 'next/server'
import { draftClientReply } from '@/lib/tools/draft-client-reply'

export async function POST(req: Request) {
  const { clientName } = await req.json()

  if (!clientName || typeof clientName !== 'string') {
    return NextResponse.json({ error: 'clientName is required' }, { status: 400 })
  }

  const result = await draftClientReply(clientName)

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json(result)
}
