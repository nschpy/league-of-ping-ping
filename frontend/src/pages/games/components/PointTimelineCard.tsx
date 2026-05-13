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
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-foreground">
          ХРОНОЛОГИЯ ОЧКОВ · СЕТ {setIndex}
        </p>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" />
            A
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500" />
            B
          </span>
        </div>
      </div>
      {points.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Хронология недоступна — счёт зафиксирован сразу
        </p>
      ) : (
        <>
          <div className="mb-2 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>0–0</span>
            <span>
              {points.filter((p) => p.scorer === 'p1').length}–{points.filter((p) => p.scorer === 'p2').length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {points.map((pt, i) => (
              <div
                key={i}
                className={cn(
                  'h-6 w-6 rounded-sm',
                  pt.scorer === 'p1' ? 'bg-primary' : 'bg-blue-500',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
