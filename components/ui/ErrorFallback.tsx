'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export function ErrorFallback({
  error,
  title = 'Something went wrong',
  onRetry,
}: {
  error: Error & { digest?: string }
  title?: string
  onRetry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="px-10 py-10 pb-16">
      <div className="border border-urgent/40 bg-urgent/5 px-8 py-12 flex flex-col items-center text-center gap-4 max-w-lg mx-auto">
        <span className="material-symbols-outlined text-urgent text-4xl">error</span>
        <div>
          <h2 className="font-headline-md text-headline-md text-primary mb-2">{title}</h2>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Something unexpected happened while loading this page. You can try again, or head back to the dashboard.
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            TRY AGAIN
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 border border-outline-variant text-on-surface-variant px-5 py-2.5 text-label-caps font-label-caps hover:bg-surface-container transition-colors"
          >
            BACK TO DASHBOARD
          </Link>
        </div>
      </div>
    </main>
  )
}
