import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { mockTailors } from '@/lib/mock-data'
import { getOrders, getMockOrders } from '@/lib/supabase/orders'
import { TailorsDashboardClient } from '@/components/tailors/TailorsDashboardClient'
import type { Tailor } from '@/types/threadflow'

export const metadata: Metadata = {
  title: 'Tailors',
}

export default async function TailorsPage() {
  let tailors: Tailor[] = mockTailors
  let orders = getMockOrders()
  let usingMockData = false

  try {
    const supabase = createClient()

    const { data: tailorsData, error: tailorsError } = await supabase
      .from('tailors')
      .select('id, name, specialty, current_load, is_available')
      .order('name', { ascending: true })

    tailors = !tailorsError && tailorsData ? (tailorsData as Tailor[]) : mockTailors

    const { data: ordersData, error: ordersError } = await getOrders()
    orders = !ordersError && ordersData ? ordersData : getMockOrders()

    usingMockData = Boolean(tailorsError) || Boolean(ordersError)
  } catch {
    usingMockData = true
  }

  return (
    <TailorsDashboardClient
      initialTailors={tailors}
      initialOrders={orders}
      usingMockData={usingMockData}
    />
  )
}
