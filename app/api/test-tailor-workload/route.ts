import { getTailorWorkload } from '@/lib/tools/get-tailor-workload'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await getTailorWorkload()
  return NextResponse.json(result)
}