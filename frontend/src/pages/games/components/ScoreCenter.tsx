import { cn } from '@/lib/utils'
import { SetStrip } from './SetStrip'
import { setsToWin } from '@/lib/game-scoring'
import type { Game } from '@/lib/types'

interface Props {
  game: Game
}

function initials(nickname: string) {
  const cleaned = nickname.replace(/[^a-zA-Zа-яА-Я0-9]/g, '')
  return cleaned.slice(0, 2).toUpperCase() || '??'
}

export function ScoreCenter({ game }: Props) {
  const { sets, format, player1, player2 } = game
  const currentSet = sets[sets.length - 1]
  const setIndex = sets.length

  const p1SetWins = sets.filter(
    (s) => s.completedAt != null && s.player1Score > s.player2Score,
  ).length
  const p2SetWins = sets.filter(
    (s) => s.completedAt != null && s.player2Score > s.player1Score,
  ).length

  const needed = setsToWin(format)

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
        Сет {setIndex} · текущий счёт
      </p>

      <div className="grid w-full grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-x-4 sm:gap-x-6">
        {/* Player 1 info */}
        <div className="flex min-w-0 flex-col items-end gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            РА
          </span>
          <span className="min-w-0 truncate font-display text-base font-semibold uppercase tracking-wide text-foreground">
            {player1.nickname}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            MMR {player1.mmr}
          </span>
        </div>

        {/* Player 1 avatar */}
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary font-display text-lg font-black text-primary-foreground">
          {initials(player1.nickname)}
        </div>

        {/* Score */}
        <div className="flex items-center gap-6 sm:gap-10">
          <span className="font-mono text-6xl font-black tabular-nums leading-none text-primary sm:text-7xl md:text-8xl">
            {currentSet?.player1Score ?? 0}
          </span>
          <span className="font-mono text-6xl font-black tabular-nums leading-none text-blue-400 sm:text-7xl md:text-8xl">
            {currentSet?.player2Score ?? 0}
          </span>
        </div>

        {/* Player 2 avatar */}
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 font-display text-lg font-black text-white">
          {initials(player2.nickname)}
        </div>

        {/* Player 2 info */}
        <div className="flex min-w-0 flex-col items-start gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
            РВ
          </span>
          <span className="min-w-0 truncate font-display text-base font-semibold uppercase tracking-wide text-foreground">
            {player2.nickname}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            MMR {player2.mmr}
          </span>
        </div>
      </div>

      {/* Set wins indicators */}
      <div className="flex items-center gap-3">
        <SetWinsBox count={p1SetWins} side="p1" />
        <SetWinsBox count={0} side="empty" />
        <SetWinsBox count={p2SetWins} side="p2" />
      </div>

      {/* Set tally */}
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        <span className="font-semibold uppercase tracking-widest">Сеты:</span>{' '}
        <span className="font-mono font-bold text-foreground">
          {p1SetWins} – {p2SetWins}
        </span>{' '}
        · до {needed} побед
      </p>

      <SetStrip sets={sets} format={format} />
    </div>
  )
}

function SetWinsBox({
  count,
  side,
}: {
  count: number
  side: 'p1' | 'p2' | 'empty'
}) {
  if (side === 'empty') {
    return (
      <div className="h-7 w-7 rounded-sm border border-border bg-card" />
    )
  }
  return (
    <div
      className={cn(
        'flex h-7 min-w-[44px] items-center justify-center gap-1 rounded-sm px-2 text-xs font-bold',
        side === 'p1'
          ? 'bg-primary text-primary-foreground'
          : 'bg-blue-500 text-white',
      )}
    >
      <span>✓</span>
      <span className="font-mono">{count}</span>
    </div>
  )
}
