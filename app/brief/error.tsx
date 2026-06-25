'use client'

import { ErrorFallback } from '@/components/ui/ErrorFallback'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return <ErrorFallback error={error} title="Couldn't prepare your brief" onRetry={unstable_retry} />
}
