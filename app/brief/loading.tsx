import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <main className="px-10 py-10 pb-16">
      <div className="mb-10">
        <Skeleton className="h-3 w-40 mb-3" />
        <Skeleton className="h-9 w-32 mb-3" />
        <Skeleton className="h-5 w-96" />
      </div>
      <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
    </main>
  )
}
