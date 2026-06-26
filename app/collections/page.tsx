import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { mockCollections } from '@/lib/mock-data'
import { getOrders, getMockOrders } from '@/lib/supabase/orders'
import { CollectionsClient } from '@/components/collections/CollectionsClient'
import type { Collection } from '@/types/threadflow'

export const metadata: Metadata = {
  title: 'Collections',
}

export default async function CollectionsPage() {
  let collections: Collection[] = mockCollections
  let collectionOrders = getMockOrders().filter((o) => o.order_type === 'collection')
  let usingMockData = false

  try {
    const supabase = createClient()

    const { data: collectionsData, error: collectionsError } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    collections = !collectionsError && collectionsData ? (collectionsData as Collection[]) : mockCollections

    const { data: ordersData, error: ordersError } = await getOrders()
    const orders = !ordersError && ordersData ? ordersData : getMockOrders()
    collectionOrders = orders.filter((o) => o.order_type === 'collection')

    usingMockData = Boolean(collectionsError) || Boolean(ordersError)
  } catch {
    usingMockData = true
  }

  return (
    <CollectionsClient
      initialCollections={collections}
      collectionOrders={collectionOrders}
      usingMockData={usingMockData}
    />
  )
}
