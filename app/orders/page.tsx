import type { Metadata } from 'next'
import { getOrders, getMockOrders } from '@/lib/supabase/orders'
import { OrdersBoardClient } from '@/components/orders/board/OrdersBoardClient'

export const metadata: Metadata = {
  title: 'Orders',
}

export default async function OrdersPage() {
  const { data, error } = await getOrders()
  const orders = !error && data ? data : getMockOrders()

  return <OrdersBoardClient initialOrders={orders} usingMockData={Boolean(error)} />
}
