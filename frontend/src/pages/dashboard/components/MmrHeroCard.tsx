import { cn } from '@/lib/utils'
import type { DashboardStats } from '@/lib/types/dashboard'
import { StatRow } from './StatRow'
import { TierProgressBar } from './TierProgressBar'

interface MmrHeroCardProps {
  stats: DashboardStats | null
}

export function MmrHeroCard({ stats }: MmrHeroCardProps) {
  if (!stats) return null

  const { mmr, tier, lastDelta, winRate, currentStreak, bestWinStreak, favoriteFormat, avgSetPointDiff } = stats

  const deltaPositive = lastDelta !== null && lastDelta > 0
  const deltaNegative = lastDelta !== null && lastDelta < 0

  const streakValue = currentStreak
    ? `${currentStreak.count}${currentStreak.kind}`
    : '—'
  const streakClass = currentStreak?.kind === 'W' ? 'text-primary' : currentStreak?.kind === 'L' ? 'text-destructive' : undefined

  const avgDiffFormatted = avgSetPointDiff !== null
    ? (avgSetPointDiff > 0 ? `+${avgSetPointDiff.toFixed(1)}` : avgSetPointDiff.toFixed(1))
    : '—'

  return (
    <div className="relative bg-card rounded-lg border border-border overflow-hidden">
      {/* Top accent stripe */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-primary" />
      <div className="grid grid-cols-[1.55fr_1fr]">
        {/* Left — MMR hero */}
        <div className="p-8 flex flex-col gap-4">
          {/* Label row */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success shrink-0" />
            <span className="text-muted-foreground text-[11px] font-mono uppercase tracking-widest">
              Текущий MMR · {tier.name}
            </span>
          </div>

          {/* Giant MMR + delta */}
          <div className="flex items-baseline gap-3">
            <span
              style={{ fontFamily: 'var(--font-display)', fontSize: 112, lineHeight: 1, letterSpacing: '-0.02em' }}
              className="text-foreground"
            >
              {mmr}
            </span>
            {lastDelta !== null && (
              <span
                className={cn(
                  'text-[22px] font-mono font-semibold',
                  deltaPositive && 'text-success',
                  deltaNegative && 'text-destructive',
                  !deltaPositive && !deltaNegative && 'text-muted-foreground',
                )}
              >
                {deltaPositive ? `+${lastDelta}` : lastDelta}
              </span>
            )}
          </div>

          {/* Tier progress */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-[12px] font-mono uppercase">{tier.name}</span>
              {tier.nextName && tier.pointsToNext !== null ? (
                <span className="text-muted-foreground text-[12px] font-mono">
                  +{tier.pointsToNext} до {tier.nextName}
                </span>
              ) : (
                <span className="text-accent text-[12px] font-mono uppercase">MAX</span>
              )}
            </div>
            <TierProgressBar progress={tier.progress} />
          </div>
        </div>

        {/* Right — stats */}
        <div className="p-8 flex flex-col justify-center gap-6 border-l border-border">
          <StatRow
            label="Винрейт"
            value={winRate ? `${winRate.percent}%` : '—'}
            sub={winRate ? `${winRate.wins} / ${winRate.total}` : undefined}
          />
          <StatRow
            label="Серия побед"
            value={streakValue}
            sub={bestWinStreak !== null ? `лучшая · ${bestWinStreak}W` : undefined}
            valueClassName={streakClass}
          />
          <StatRow
            label="Любимый формат"
            value={favoriteFormat ? favoriteFormat.format : '—'}
            sub={favoriteFormat ? `${favoriteFormat.percent}% матчей` : undefined}
          />
          <StatRow
            label="Средняя разница"
            value={avgDiffFormatted}
            sub={avgSetPointDiff !== null ? 'очков за сет' : undefined}
          />
        </div>
      </div>
    </div>
  )
}
