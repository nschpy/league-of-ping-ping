import { cn } from '@/lib/utils'
import type { GameSet } from '@/lib/types'

interface Props {
  set: GameSet | undefined
  setIndex: number
}

function maxStreak(points: Array<{ scorer: 'p1' | 'p2' }>, player: 'p1' | 'p2'): number {
  let max = 0
  let cur = 0
  for (const pt of points) {
    cur = pt.scorer === player ? cur + 1 : 0
    if (cur > max) max = cur
  }
  return max
}

export function PointTimelineCard({ set, setIndex }: Props) {
  const points = set?.points ?? []
  const p1Score = points.filter((p) => p.scorer === 'p1').length
  const p2Score = points.filter((p) => p.scorer === 'p2').length
  const streakA = maxStreak(points, 'p1')
  const streakB = maxStreak(points, 'p2')

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold uppercase tracking-widest text-foreground">
          ХРОНОЛОГИЯ ОЧКОВ · СЕТ {setIndex}
        </p>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            A
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            B
          </span>
        </div>
      </div>

      {points.length > 0 && (
        <>
          <div className="mb-3 flex flex-col gap-1 overflow-x-auto">
            <div className="flex gap-1">
              {points.map((pt, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-7 w-7 shrink-0 rounded-sm',
                    pt.scorer === 'p1' ? 'bg-primary' : 'bg-white/[0.07]',
                  )}
                />
              ))}
            </div>
            <div className="flex gap-1">
              {points.map((pt, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-7 w-7 shrink-0 rounded-sm',
                    pt.scorer === 'p2' ? 'bg-blue-500' : 'bg-white/[0.07]',
                  )}
                />
              ))}
            </div>
          </div>

          <div className="mb-4 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>0–0</span>
            <span>
              {p1Score}–{p2Score}
            </span>
          </div>
        </>
      )}

      <div className="border-t border-border pt-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Серия А
            </p>
            <p className="text-2xl font-bold text-foreground">
              {points.length > 0 ? streakA : '—'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Серия В
            </p>
            <p className="text-2xl font-bold text-foreground">
              {points.length > 0 ? streakB : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
