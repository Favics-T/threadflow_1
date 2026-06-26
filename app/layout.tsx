import type { Metadata } from 'next'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import { mockMessages } from '@/lib/mock-data'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export const metadata: Metadata = {
  title: {
    default: 'ThreadFlow AI',
    template: '%s | ThreadFlow AI',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let unreadCount = mockMessages.filter((m) => m.status === 'unresponded').length

  try {
    const supabase = createClient()
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'unresponded')

    if (!error && count !== null) {
      unreadCount = count
    }
  } catch {
    // Supabase unreachable or misconfigured — keep the mock-data fallback
  }

  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen bg-background">
        <Topbar unreadCount={unreadCount} />
        <div className="flex pt-[52px]">
          <Sidebar unreadCount={unreadCount} />
          <main className="flex-1 md:ml-24 min-h-screen overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
