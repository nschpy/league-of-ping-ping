import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { initials, avatarColor } from '@/lib/player'
import type { ProfileResult } from '@/lib/types/profile'

const ACHIEVEMENT_ICONS: Record<string, string> = {
  top3: '🏆',
  top10: '🥈',
  streak: '⚡',
  winrate: '🎯',
  veteran: '🛡️',
}

const RUSSIAN_MONTHS: Record<number, string> = {
  0: 'янв', 1: 'фев', 2: 'мар', 3: 'апр', 4: 'май', 5: 'июн',
  6: 'июл', 7: 'авг', 8: 'сен', 9: 'окт', 10: 'ноя', 11: 'дек',
}

function formatMonthYear(isoString: string): string {
  try {
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return ''
    return `${RUSSIAN_MONTHS[d.getMonth()]} ${d.getFullYear()}`
  } catch {
    return ''
  }
}

interface ProfileHeroCardProps {
  data: ProfileResult
  onEdit: () => void
}

export function ProfileHeroCard({ data, onEdit }: ProfileHeroCardProps) {
  const { user, stats, achievements } = data
  const avatarBg = avatarColor(user.nickname)
  const avatarInitials = initials(user.nickname)

  const visibleAchievements = achievements.slice(0, 3)

  // Streak display
  const streakValue = stats.currentStreak
    ? `${stats.currentStreak.count}${stats.currentStreak.kind}`
    : '—'
  const streakClass =
    stats.currentStreak?.kind === 'W'
      ? 'text-success'
      : stats.currentStreak?.kind === 'L'
        ? 'text-destructive'
        : undefined

  // Win rate display
  const winRateValue = stats.winRate ? `${stats.winRate.percent}%` : '—'
  const winRateClass =
    stats.winRate && stats.winRate.percent >= 60 ? 'text-success' : undefined

  // Last delta display
  const showDelta = user.isMe && stats.lastDelta !== null
  const deltaPositive = stats.lastDelta !== null && stats.lastDelta > 0
  const deltaNegative = stats.lastDelta !== null && stats.lastDelta < 0
  const deltaLabel = stats.lastDelta !== null
    ? `${stats.lastDelta > 0 ? '+' : ''}${stats.lastDelta} за посл. матч`
    : ''

  // Meta row items
  const metaItems: string[] = []
  if (user.isMe && user.email) metaItems.push(user.email)
  if (user.city) metaItems.push(user.city)
  const monthYear = formatMonthYear(user.createdAt)
  if (monthYear) metaItems.push(`с ${monthYear}`)

  // Stats grid
  const statBlocks = [
    { label: 'Матчи', value: String(stats.totalGames), colorClass: undefined },
    { label: 'Победы', value: String(stats.wins), colorClass: 'text-success' },
    { label: 'Поражения', value: String(stats.losses), colorClass: 'text-destructive' },
    { label: 'Win Rate', value: winRateValue, colorClass: winRateClass },
    { label: 'Серия', value: streakValue, colorClass: streakClass },
    {
      label: 'Лучш. серия',
      value: stats.bestWinStreak !== null ? `${stats.bestWinStreak}W` : '—',
      colorClass: undefined,
    },
    {
      label: 'Ср. сеты/W',
      value: stats.avgSetsPerWin !== null ? stats.avgSetsPerWin.toFixed(1) : '—',
      colorClass: undefined,
    },
  ]

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden relative shadow-sm">
      {/* Grid: col1 | col2 | col3 */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto]">
        {/* Column 1: Avatar + tier + achievements */}
        <div className="p-6 lg:p-8 flex flex-col items-center gap-4 border-b lg:border-b-0 lg:border-r border-border">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-lg border-2 border-primary flex items-center justify-center shrink-0"
            style={{ background: avatarBg }}
          >
            <span
              className="text-primary"
              style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, lineHeight: 1 }}
            >
              {avatarInitials}
            </span>
          </div>

          {/* Tier badge */}
          <div className="bg-primary/10 text-primary border border-primary/40 rounded-full px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-widest">
            {user.tier.name}
          </div>

          {/* Achievement chips */}
          {visibleAchievements.length > 0 && (
            <div className="flex flex-col gap-1.5 w-full">
              {visibleAchievements.map((ach) => (
                <div
                  key={ach.key}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-muted/40 rounded-md w-full"
                >
                  <span style={{ fontSize: 16 }}>
                    {ACHIEVEMENT_ICONS[ach.key] ?? '🏅'}
                  </span>
                  <div>
                    <div className="text-[12px] font-semibold text-foreground">{ach.label}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{ach.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Nickname + meta + stats grid */}
        <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-border">
          {/* Nickname */}
          <div
            className="text-foreground"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 5vw, 42px)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              fontWeight: 700,
            }}
          >
            {user.nickname}
          </div>

          {/* Meta row */}
          {metaItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {metaItems.map((item, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  {idx > 0 && (
                    <span className="text-muted-foreground/60 text-[12px] font-mono">·</span>
                  )}
                  <span className="text-[12px] font-mono text-muted-foreground">{item}</span>
                </span>
              ))}
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
            {statBlocks.map((stat) => (
              <div key={stat.label} className="bg-muted/40 rounded-md px-3 py-2.5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  {stat.label}
                </div>
                <div
                  className={cn('text-foreground', stat.colorClass)}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    letterSpacing: '-0.01em',
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: MMR + rank + edit */}
        <div className="p-6 lg:p-8 flex flex-col gap-5 min-w-[160px]">
          {/* MMR block */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              текущий MMR
            </div>
            <div
              className="text-primary"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 72,
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {user.mmr}
            </div>
            {showDelta && (
              <div
                className={cn(
                  'text-[13px] font-mono font-bold mt-2',
                  deltaPositive && 'text-success',
                  deltaNegative && 'text-destructive',
                  !deltaPositive && !deltaNegative && 'text-muted-foreground',
                )}
              >
                {deltaLabel}
              </div>
            )}
          </div>

          {/* Rank block */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              место в лиге
            </div>
            <div
              className="text-foreground"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 56,
                lineHeight: 0.85,
                letterSpacing: '-0.03em',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <span
                className="text-muted-foreground"
                style={{ fontSize: 28 }}
              >
                #
              </span>
              {String(user.rank).padStart(2, '0')}
            </div>
          </div>

          <div className="flex-1" />

          {/* Edit button */}
          {user.isMe && (
            <Button variant="ghost" size="sm" className="w-full" onClick={onEdit}>
              Редактировать
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
