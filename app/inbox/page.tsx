import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { mockMessages, mockCollections } from '@/lib/mock-data'
import { InboxClient } from '@/components/inbox/InboxClient'
import type { Collection, Message } from '@/types/threadflow'

export const metadata: Metadata = {
  title: 'Inbox',
}

export default async function InboxPage() {
  let messages: Message[] = mockMessages
  let collections: Collection[] = mockCollections
  let usingMockData = false

  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: collectionsData, error: collectionsError } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    messages = !error && data ? (data as Message[]) : mockMessages
    collections = !collectionsError && collectionsData ? (collectionsData as Collection[]) : mockCollections
    usingMockData = Boolean(error) || Boolean(collectionsError)
  } catch {
    usingMockData = true
  }

  return (
    <InboxClient
      initialMessages={messages}
      collections={collections}
      usingMockData={usingMockData}
    />
  )
}
