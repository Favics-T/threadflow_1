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
  let messages: Message[] = mockMessages
  let tailors: Tailor[] = mockTailors
  let orders = getMockOrders()

  try {
    const supabase = createClient()

    const { data: messagesData, error: messagesError } = await supabase.from('messages').select('*')
    messages = !messagesError && messagesData ? (messagesData as Message[]) : mockMessages

    const { data: tailorsData, error: tailorsError } = await supabase
      .from('tailors')
      .select('id, name, specialty, current_load, is_available')
    tailors = !tailorsError && tailorsData ? (tailorsData as Tailor[]) : mockTailors

    const { data: ordersData, error: ordersError } = await getOrders()
    orders = !ordersError && ordersData ? ordersData : getMockOrders()
  } catch {
    // Supabase unreachable or misconfigured — keep the mock-data fallback
  }

  const snapshot = buildBriefSnapshot(messages, orders, tailors)

  return <BriefClient snapshot={snapshot} />
}
