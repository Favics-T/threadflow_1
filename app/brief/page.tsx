import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { mockMessages, mockTailors } from '@/lib/mock-data'
import { getOrders, getMockOrders } from '@/lib/supabase/orders'
import { buildBriefSnapshot } from '@/lib/brief'
import { BriefClient } from '@/components/brief/BriefClient'
import type { Message, Tailor } from '@/types/threadflow'

export const metadata: Metadata = {
  title: 'Brief Me',
}

export default async function BriefPage() {
  const supabase = createClient()

  const { data: messagesData, error: messagesError } = await supabase.from('messages').select('*')
  const messages: Message[] = !messagesError && messagesData ? (messagesData as Message[]) : mockMessages

  const { data: tailorsData, error: tailorsError } = await supabase
    .from('tailors')
    .select('id, name, specialty, current_load, is_available')
  const tailors: Tailor[] = !tailorsError && tailorsData ? (tailorsData as Tailor[]) : mockTailors

  const { data: ordersData, error: ordersError } = await getOrders()
  const orders = !ordersError && ordersData ? ordersData : getMockOrders()

  const snapshot = buildBriefSnapshot(messages, orders, tailors)

  return <BriefClient snapshot={snapshot} />
}
