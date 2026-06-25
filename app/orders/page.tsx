import { getOrders, getMockOrders } from '@/lib/supabase/orders'
import { OrdersBoardClient } from '@/components/orders/board/OrdersBoardClient'

export default async function OrdersPage() {
  const { data, error } = await getOrders()
  const orders = !error && data ? data : getMockOrders()

  return <OrdersBoardClient initialOrders={orders} usingMockData={Boolean(error)} />
}
