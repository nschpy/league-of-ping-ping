import { cn } from '@/lib/utils'
import { formatDuration } from '@/lib/time'
import type { Game } from '@/lib/types'

interface Props {
  game: Game
}

const winsNeeded: Record<string, number> = { bo1: 1, bo3: 2, bo5: 3 }
const formatLabel: Record<string, string> = { bo1: 'BO1', bo3: 'BO3', bo5: 'BO5' }

export function SetBreakdownCard({ game }: Props) {
  const completedSets = game.sets.filter((s) => s.completedAt != null)
  const needed = winsNeeded[game.format] ?? 1

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-base uppercase tracking-widest text-foreground">
          РАЗБОР ПО СЕТАМ
        </p>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {formatLabel[game.format]} · ДО {needed}{' '}
          {needed === 1 ? 'ПОБЕДЫ' : 'ПОБЕД'}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {completedSets.map((set, i) => {
          const setP1Won = set.player1Score > set.player2Score
          const winnerPlayer = setP1Won ? game.player1 : game.player2
          const prevTime =
            i === 0
              ? new Date(game.startedAt).getTime()
              : new Date(completedSets[i - 1].completedAt!).getTime()
          const duration = formatDuration(new Date(set.completedAt!).getTime() - prevTime)

          return (
            <div
              key={i}
              className="grid grid-cols-[60px_1fr_auto_56px] items-center gap-3 rounded-md border bg-background/40 px-3.5 py-3"
            >
              {/* Set label */}
              <span className="font-display text-[11px] uppercase tracking-widest text-muted-foreground">
                СЕТ {i + 1}
              </span>

              {/* Winner label */}
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={cn(
                    'h-2.5 w-2.5 flex-shrink-0 rounded-sm',
                    setP1Won ? 'bg-primary' : 'bg-blue-500',
                  )}
                />
                <span className="truncate font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                  ВЫИГРАЛ {winnerPlayer.nickname.toUpperCase()}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center gap-1 font-display tabular-nums">
                <span
                  className={cn(
                    'text-2xl font-black leading-none',
                    setP1Won ? 'text-primary' : 'opacity-50 text-foreground',
                  )}
                >
                  {set.player1Score}
                </span>
                <span className="text-lg font-black leading-none text-muted-foreground">–</span>
                <span
                  className={cn(
                    'text-2xl font-black leading-none',
                    setP1Won ? 'opacity-50 text-foreground' : 'text-blue-400',
                  )}
                >
                  {set.player2Score}
                </span>
              </div>

              {/* Duration */}
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground text-right">
                {duration}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
