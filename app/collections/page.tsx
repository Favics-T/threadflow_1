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
  const supabase = createClient()

  const { data: collectionsData, error: collectionsError } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })

  const collections: Collection[] =
    !collectionsError && collectionsData ? (collectionsData as Collection[]) : mockCollections

  const { data: ordersData, error: ordersError } = await getOrders()
  const orders = !ordersError && ordersData ? ordersData : getMockOrders()
  const collectionOrders = orders.filter((o) => o.order_type === 'collection')

  return (
    <CollectionsClient
      initialCollections={collections}
      collectionOrders={collectionOrders}
      usingMockData={Boolean(collectionsError) || Boolean(ordersError)}
    />
  )
}
