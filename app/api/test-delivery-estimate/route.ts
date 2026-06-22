import { calculateDeliveryEstimate } from '@/lib/tools/calculate-delivery-estimate'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('orderId') || ''

  if (!orderId) {
    return NextResponse.json({ error: 'orderId is required' })
  }

  const result = await calculateDeliveryEstimate(orderId)
  return NextResponse.json(result)
}