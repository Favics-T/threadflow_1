import { createClient } from '@/lib/supabase/server'
import { mockMessages } from '@/lib/mock-data'
import { InboxClient } from '@/components/inbox/InboxClient'
import type { Message } from '@/types/threadflow'

export default async function InboxPage() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  const messages: Message[] = !error && data ? (data as Message[]) : mockMessages

  return <InboxClient initialMessages={messages} usingMockData={Boolean(error)} />
}
