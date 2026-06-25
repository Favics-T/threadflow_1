import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <main className="px-10 py-10 pb-16">
      <div className="mb-10">
        <Skeleton className="h-3 w-28 mb-3" />
        <Skeleton className="h-9 w-48 mb-3" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, col) => (
          <div key={col} className="flex flex-col gap-3">
            <Skeleton className="h-4 w-28 mb-2" />
            {Array.from({ length: 2 }).map((_, row) => (
              <Skeleton key={row} className="h-32 w-full" />
            ))}
          </div>
        ))}
      </div>
    </main>
  )
}
