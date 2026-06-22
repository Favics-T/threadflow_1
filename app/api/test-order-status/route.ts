import { findClient } from '@/lib/tools/find-client'
import { getOrderStatus } from '@/lib/tools/get-order-status'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name') || ''

  const clientResult = await findClient(name)

  if ('error' in clientResult) {
    return NextResponse.json({ error: clientResult.error })
  }

  if ('ambiguous' in clientResult) {
    return NextResponse.json(clientResult)
  }

  const orderResult = await getOrderStatus(clientResult.client.id)
  return NextResponse.json({ client: clientResult.client.name, ...orderResult })
}