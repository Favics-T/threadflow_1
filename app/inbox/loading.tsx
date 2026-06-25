import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <main className="px-10 py-10 pb-16">
      <div className="mb-10">
        <Skeleton className="h-3 w-40 mb-3" />
        <Skeleton className="h-9 w-32 mb-3" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="flex items-center gap-2 mb-8 border-b border-outline-variant pb-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    </main>
  )
}
