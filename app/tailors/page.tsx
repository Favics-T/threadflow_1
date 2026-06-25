import { createClient } from '@/lib/supabase/server'
import { mockTailors } from '@/lib/mock-data'
import { getOrders, getMockOrders } from '@/lib/supabase/orders'
import { TailorsDashboardClient } from '@/components/tailors/TailorsDashboardClient'
import type { Tailor } from '@/types/threadflow'

export default async function TailorsPage() {
  const supabase = createClient()

  const { data: tailorsData, error: tailorsError } = await supabase
    .from('tailors')
    .select('id, name, specialty, current_load, is_available')
    .order('name', { ascending: true })

  const tailors: Tailor[] = !tailorsError && tailorsData ? (tailorsData as Tailor[]) : mockTailors

  const { data: ordersData, error: ordersError } = await getOrders()
  const orders = !ordersError && ordersData ? ordersData : getMockOrders()

  return (
    <TailorsDashboardClient
      initialTailors={tailors}
      initialOrders={orders}
      usingMockData={Boolean(tailorsError) || Boolean(ordersError)}
    />
  )
}
