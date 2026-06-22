import { checkFabricStock } from '@/lib/tools/check-fabric-stock'
import { flagLowStock } from '@/lib/tools/flagLowStock'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action') || 'check'
  const material = searchParams.get('material') || ''

  if (action === 'flag') {
    const result = await flagLowStock()
    return NextResponse.json(result)
  }

  const result = await checkFabricStock(material)
  return NextResponse.json(result)
}