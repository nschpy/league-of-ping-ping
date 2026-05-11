import { mmrDelta } from '@/lib/game-scoring'
import type { PlayerSummary, GameFormat } from '@/lib/types'

interface MatchSummaryCardProps {
  player1: PlayerSummary
  player2: PlayerSummary
  format: GameFormat
}

function formatDelta(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`
}

export function MatchSummaryCard({ player1, player2, format }: MatchSummaryCardProps) {
  const mmrDiff = player1.mmr - player2.mmr
  const p1WinDelta = mmrDelta(player1.mmr, player2.mmr, true, format)
  const p1LossDelta = mmrDelta(player1.mmr, player2.mmr, false, format)

  const columns = [
    { label: 'Формат', value: format.toUpperCase() },
    {
      label: 'Разница MMR',
      value: mmrDiff >= 0 ? `+${mmrDiff}` : `${mmrDiff}`,
    },
    { label: 'При победе', value: formatDelta(p1WinDelta) },
    { label: 'При поражении', value: formatDelta(p1LossDelta) },
  ]

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Итог матча
      </p>
      <div className="grid grid-cols-4 divide-x divide-border">
        {columns.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1 px-2 first:pl-0 last:pr-0">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="font-display text-xl font-bold text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
