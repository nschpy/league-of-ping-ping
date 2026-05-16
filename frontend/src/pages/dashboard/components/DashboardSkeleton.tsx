import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-5">
      <Skeleton className="h-[220px] w-full rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.4fr_1fr] gap-5">
        <Skeleton className="h-[220px] w-full rounded-lg" />
        <Skeleton className="h-[280px] w-full rounded-lg" />
        <Skeleton className="h-[220px] w-full rounded-lg" />
      </div>
    </div>
  )
}
