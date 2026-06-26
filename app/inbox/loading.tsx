import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <main className="px-10 py-10 pb-16">
      <div className="mb-10">
        <Skeleton className="h-3 w-40 mb-3" />
        <Skeleton className="h-9 w-32 mb-3" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="flex flex-col gap-px border border-outline-variant">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </main>
  )
}
