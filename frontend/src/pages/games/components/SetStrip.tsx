import { cn } from '@/lib/utils'
import type { GameSet, GameFormat } from '@/lib/types'
import { setsToWin } from '@/lib/game-scoring'

interface Props {
  sets: GameSet[]
  format: GameFormat
}

function formatDuration(startIso: string | undefined, endIso?: string) {
  if (!startIso) return null
  const start = new Date(startIso).getTime()
  const end = endIso ? new Date(endIso).getTime() : Date.now()
  const seconds = Math.max(0, Math.floor((end - start) / 1000))
  const mm = Math.floor(seconds / 60)
  const ss = seconds % 60
  return `${mm}:${ss.toString().padStart(2, '0')}`
}

export function SetStrip({ sets, format }: Props) {
  const total = setsToWin(format) * 2 - 1
  const slots = Array.from({ length: total }, (_, i) => sets[i] ?? null)

  return (
    <div className="flex w-full max-w-2xl flex-wrap justify-center gap-3">
      {slots.map((set, i) => {
        const isActive = set !== null && !set.completedAt && i === sets.length - 1
        const isEmpty = set === null
        const setStart = set?.points[0]?.at
        const duration = !isEmpty ? formatDuration(setStart, set.completedAt) : null

        return (
          <div
            key={i}
            className={cn(
              'flex min-w-[140px] flex-1 items-center justify-between gap-3 rounded-md border px-3 py-2',
              isActive && 'border-primary bg-primary/5',
              !isActive && !isEmpty && 'border-border bg-card',
              isEmpty && 'border-dashed border-border bg-transparent opacity-40',
            )}
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Сет {i + 1}
                {isActive && (
                  <span className="rounded-sm bg-primary px-1 py-px text-[9px] font-bold text-primary-foreground">
                    LIVE
                  </span>
                )}
              </span>
              {duration && (
                <span className="font-mono text-[10px] text-muted-foreground">
                  {duration}
                </span>
              )}
            </div>
            {isEmpty ? (
              <span className="font-mono text-base text-muted-foreground">—</span>
            ) : (
              <span
                className={cn(
                  'font-mono text-xl font-black tabular-nums',
                  isActive ? 'text-foreground' : 'text-foreground',
                )}
              >
                <span className="text-foreground">{set.player1Score}</span>
                <span className="text-muted-foreground">-</span>
                <span className="text-blue-400">{set.player2Score}</span>
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
