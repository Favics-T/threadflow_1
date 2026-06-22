import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ThreadFlow — Fashion Studio Manager',
  description: 'AI-powered operations manager for fashion houses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <body className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}