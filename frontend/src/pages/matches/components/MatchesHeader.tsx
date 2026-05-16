import type { RecentMatch } from '@/lib/types/dashboard'
import { cn } from '@/lib/utils'

interface MatchesHeaderProps {
  matches: RecentMatch[]
}

export function MatchesHeader({ matches }: MatchesHeaderProps) {
  const wins = matches.filter(m => m.outcome === 'win').length
  const losses = matches.filter(m => m.outcome === 'loss').length
  const avgDelta =
    matches.length === 0
      ? null
      : Math.round(matches.reduce((s, m) => s + m.mmrDelta, 0) / matches.length)

  const tiles = [
    { label: 'победы', value: String(wins), colorClass: 'text-success' },
    { label: 'поражения', value: String(losses), colorClass: 'text-destructive' },
    {
      label: 'средн. Δ MMR',
      value:
        avgDelta === null
          ? '—'
          : avgDelta > 0
            ? `+${avgDelta}`
            : String(avgDelta),
      colorClass:
        avgDelta === null
          ? 'text-muted-foreground'
          : avgDelta > 0
            ? 'text-success'
            : avgDelta < 0
              ? 'text-destructive'
              : 'text-muted-foreground',
    },
  ]

  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          история · {matches.length} матчей
        </p>
        <h1
          className="text-[36px] leading-none"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Матчи
        </h1>
      </div>

      <div className="flex gap-4">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="bg-card rounded-lg border border-border text-center px-5 py-2.5"
          >
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              {tile.label}
            </p>
            <p
              className={cn(
                'text-[24px] font-mono tabular-nums leading-none',
                tile.colorClass,
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {tile.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
