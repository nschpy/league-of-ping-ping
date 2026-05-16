import { Skeleton } from '@/components/ui/skeleton'

export function MatchesSkeleton() {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-end justify-between gap-4">
        <Skeleton className="h-[60px] w-[200px] rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-[60px] w-[90px] rounded-lg" />
          <Skeleton className="h-[60px] w-[90px] rounded-lg" />
          <Skeleton className="h-[60px] w-[90px] rounded-lg" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        <Skeleton className="h-9 w-16 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      {/* Match rows */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[76px] w-full rounded-none" />
        ))}
      </div>
    </div>
  )
}
