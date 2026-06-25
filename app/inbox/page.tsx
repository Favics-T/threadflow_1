import { createClient } from '@/lib/supabase/server'
import { mockMessages, mockCollections } from '@/lib/mock-data'
import { InboxClient } from '@/components/inbox/InboxClient'
import type { Collection, Message } from '@/types/threadflow'

export default async function InboxPage() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: collectionsData, error: collectionsError } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })

  const messages: Message[] = !error && data ? (data as Message[]) : mockMessages
  const collections: Collection[] =
    !collectionsError && collectionsData ? (collectionsData as Collection[]) : mockCollections

  return (
    <InboxClient
      initialMessages={messages}
      collections={collections}
      usingMockData={Boolean(error)}
    />
  )
}
