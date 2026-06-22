import { findClient } from '@/lib/tools/find-client'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name') || ''

  const result = await findClient(name)
  return NextResponse.json(result)
}