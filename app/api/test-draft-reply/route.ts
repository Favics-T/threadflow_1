import { draftClientReply } from '@/lib/tools/draft-client-reply'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name') || ''

  if (!name) {
    return NextResponse.json({ error: 'name is required' })
  }

  const result = await draftClientReply(name)
  return NextResponse.json(result)
}