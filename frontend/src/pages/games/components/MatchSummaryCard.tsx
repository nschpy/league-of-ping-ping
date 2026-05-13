import { cn } from '@/lib/utils'
import { mmrDelta } from '@/lib/game-scoring'
import type { PlayerSummary, GameFormat } from '@/lib/types'

interface MatchSummaryCardProps {
  player1: PlayerSummary
  player2: PlayerSummary
  format: GameFormat
}

type ValueTone = 'neutral' | 'positive' | 'negative'

function formatDelta(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`
}

function toneFromDelta(n: number): ValueTone {
  if (n > 0) return 'positive'
  if (n < 0) return 'negative'
  return 'neutral'
}

const TONE_CLASS: Record<ValueTone, string> = {
  neutral: 'text-foreground',
  positive: 'text-success',
  negative: 'text-destructive',
}

export function MatchSummaryCard({ player1, player2, format }: MatchSummaryCardProps) {
  const mmrDiff = player1.mmr - player2.mmr
  const p1WinDelta = mmrDelta(player1.mmr, player2.mmr, true, format)
  const p1LossDelta = mmrDelta(player1.mmr, player2.mmr, false, format)

  const columns: { label: string; value: string; tone: ValueTone }[] = [
    { label: 'Формат', value: format.toUpperCase(), tone: 'neutral' },
    {
      label: 'Разница MMR',
      value: formatDelta(mmrDiff),
      tone: toneFromDelta(mmrDiff),
    },
    {
      label: 'При победе',
      value: formatDelta(p1WinDelta),
      tone: toneFromDelta(p1WinDelta),
    },
    {
      label: 'При поражении',
      value: formatDelta(p1LossDelta),
      tone: toneFromDelta(p1LossDelta),
    },
  ]

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="absolute inset-x-0 top-0 h-px bg-primary" />

      <div className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Сводка матча
            </p>
            <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Match #—
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            будет создана сразу после старта
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {columns.map(({ label, value, tone }, i) => (
            <div
              key={label}
              className={cn(
                'flex flex-col gap-1.5 sm:px-4',
                i > 0 && 'sm:border-l sm:border-l-primary',
                i === 0 && 'sm:pl-0',
              )}
            >
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
              <span
                className={cn(
                  'font-display text-4xl font-bold leading-none',
                  TONE_CLASS[tone],
                )}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
