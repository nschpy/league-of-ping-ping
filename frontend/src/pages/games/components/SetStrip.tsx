import { cn } from '@/lib/utils'
import type { GameSet, GameFormat } from '@/lib/types'
import { setsToWin } from '@/lib/game-scoring'

interface Props {
  sets: GameSet[]
  format: GameFormat
}

export function SetStrip({ sets, format }: Props) {
  const total = setsToWin(format) * 2 - 1
  const slots = Array.from({ length: total }, (_, i) => sets[i] ?? null)

  return (
    <div className="flex gap-2">
      {slots.map((set, i) => {
        const isActive = set !== null && !set.completedAt && i === sets.length - 1
        const isEmpty = set === null
        return (
          <div
            key={i}
            className={cn(
              'flex min-w-[52px] flex-col items-center rounded-lg border px-3 py-2 text-center',
              isActive && 'border-primary bg-primary/5',
              !isActive && !isEmpty && 'border-border bg-card',
              isEmpty && 'border-dashed border-border bg-transparent opacity-40',
            )}
          >
            <span className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase text-muted-foreground">
              СЕТ {i + 1}
              {isActive && (
                <span className="rounded-full bg-primary px-1 text-[9px] text-primary-foreground">
                  LIVE
                </span>
              )}
            </span>
            {isEmpty ? (
              <span className="font-mono text-sm text-muted-foreground">—</span>
            ) : (
              <span className="font-mono text-sm font-bold">
                {set.player1Score}–{set.player2Score}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
