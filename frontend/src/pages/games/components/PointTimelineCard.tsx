import { cn } from '@/lib/utils'
import type { GameSet } from '@/lib/types'

interface Props {
  set: GameSet | undefined
  setIndex: number
}

export function PointTimelineCard({ set, setIndex }: Props) {
  const points = set?.points ?? []

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="mb-4 text-sm font-semibold text-foreground">
        Хронология очков · сет {setIndex}
      </p>
      {points.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Хронология недоступна — счёт зафиксирован сразу
        </p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {points.map((pt, i) => (
            <div key={i} className="flex h-4 items-center gap-1">
              <span className="w-5 text-right text-[10px] text-muted-foreground">{i + 1}</span>
              <div className="flex flex-1 overflow-hidden rounded-sm">
                <div
                  className={cn(
                    'h-4 flex-1 rounded-l-sm',
                    pt.scorer === 'p1' ? 'bg-primary' : 'bg-muted',
                  )}
                />
                <div
                  className={cn(
                    'h-4 flex-1 rounded-r-sm',
                    pt.scorer === 'p2' ? 'bg-blue-500' : 'bg-muted',
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
