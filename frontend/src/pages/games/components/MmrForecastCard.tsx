import { cn } from '@/lib/utils'
import { mmrDelta } from '@/lib/game-scoring'
import type { Game } from '@/lib/types'

interface Props {
  game: Game
}

function initials(nickname: string) {
  const cleaned = nickname.replace(/[^a-zA-Zа-яА-Я0-9]/g, '')
  return cleaned.slice(0, 2).toUpperCase() || '??'
}

export function MmrForecastCard({ game }: Props) {
  const { player1, player2, player1MmrBefore, player2MmrBefore, format } = game
  const isCompleted = game.status === 'completed'

  const p1WinDelta = isCompleted
    ? game.player1MmrChange
    : mmrDelta(player1MmrBefore, player2MmrBefore, true, format)
  const p1LoseDelta = isCompleted ? null : mmrDelta(player1MmrBefore, player2MmrBefore, false, format)
  const p2WinDelta = isCompleted
    ? game.player2MmrChange
    : mmrDelta(player2MmrBefore, player1MmrBefore, true, format)
  const p2LoseDelta = isCompleted ? null : mmrDelta(player2MmrBefore, player1MmrBefore, false, format)

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground">
        {isCompleted ? 'ИЗМЕНЕНИЕ MMR' : 'ПРОГНОЗ MMR'}
      </p>
      <div className="flex flex-col gap-4">
        {[
          { player: player1, mmrBefore: player1MmrBefore, winDelta: p1WinDelta, loseDelta: p1LoseDelta, isP1: true },
          { player: player2, mmrBefore: player2MmrBefore, winDelta: p2WinDelta, loseDelta: p2LoseDelta, isP1: false },
        ].map(({ player, mmrBefore, winDelta, loseDelta, isP1 }) => (
          <div key={player.id} className="rounded-md border bg-background/40 p-3">
            {/* Player header row */}
            <div className="mb-3 flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md font-display text-sm font-black',
                  isP1 ? 'bg-primary text-primary-foreground' : 'bg-blue-500 text-white',
                )}
              >
                {initials(player.nickname)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{player.nickname}</p>
              </div>
              <span className="flex-shrink-0 font-mono text-sm font-bold text-foreground">{mmrBefore}</span>
            </div>
            {/* WIN / LOSS badges */}
            {isCompleted ? (
              <div className="rounded-md border bg-card px-3 py-2 text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Применено</p>
                <p className="font-mono text-lg font-black">
                  {winDelta !== null ? (winDelta >= 0 ? '+' : '') + winDelta : '—'}
                </p>
                {winDelta !== null && (
                  <p className="font-mono text-xs text-muted-foreground">{mmrBefore + winDelta}</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {/* WIN badge */}
                <div className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-green-400">WIN</p>
                  <p className="font-mono text-lg font-black text-green-400">
                    {winDelta !== null ? (winDelta >= 0 ? '+' : '') + winDelta : '—'}
                  </p>
                  {winDelta !== null && (
                    <p className="font-mono text-xs text-muted-foreground">{mmrBefore + winDelta}</p>
                  )}
                </div>
                {/* LOSS badge */}
                <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-red-400">LOSS</p>
                  <p className="font-mono text-lg font-black text-red-400">
                    {loseDelta !== null ? (loseDelta >= 0 ? '+' : '') + loseDelta : '—'}
                  </p>
                  {loseDelta !== null && (
                    <p className="font-mono text-xs text-muted-foreground">{mmrBefore + loseDelta}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-muted-foreground">
        Изменение MMR симметрично · базовая ставка 25, скорректирована под разницу рейтингов.
      </p>
    </div>
  )
}
