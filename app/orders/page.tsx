import type { Metadata } from 'next'
import { getOrders, getMockOrders } from '@/lib/supabase/orders'
import { OrdersBoardClient } from '@/components/orders/board/OrdersBoardClient'

export const metadata: Metadata = {
  title: 'Orders',
}

export default async function OrdersPage() {
  let orders = getMockOrders()
  let usingMockData = false

  try {
    const { data, error } = await getOrders()
    orders = !error && data ? data : getMockOrders()
    usingMockData = Boolean(error)
  } catch {
    usingMockData = true
  }

  return <OrdersBoardClient initialOrders={orders} usingMockData={usingMockData} />
}
