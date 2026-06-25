import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <main className="px-10 py-10 pb-16">
      <div className="flex justify-between items-end mb-10 flex-wrap gap-6">
        <div>
          <Skeleton className="h-3 w-28 mb-3" />
          <Skeleton className="h-9 w-32 mb-3" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-11 w-64" />
      </div>
      <Skeleton className="h-4 w-44 mb-6" />
      <div className="flex flex-col gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    </main>
  )
}
