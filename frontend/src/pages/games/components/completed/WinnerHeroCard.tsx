import { Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { initials, playerTileClasses, playerAccentClasses } from '@/lib/player'
import type { Game, PlayerSummary } from '@/lib/types'

interface Props {
  game: Game
}

interface PlayerLineProps {
  player: PlayerSummary
  isP1: boolean
  sets: number
  label: 'WIN' | 'LOSS'
  align: 'left' | 'right'
}

function PlayerLine({ player, isP1, sets, label, align }: PlayerLineProps) {
  const isRight = align === 'right'
  return (
    <div className={cn('flex items-center gap-3', isRight && 'flex-row-reverse')}>
      {/* Avatar 44x44 */}
      <div
        className={cn(
          'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md font-display text-sm font-black',
          playerTileClasses(isP1),
        )}
      >
        {initials(player.nickname)}
      </div>
      <div className={cn('min-w-0', isRight ? 'text-right' : 'text-left')}>
        <p
          className={cn(
            'text-[11px] uppercase tracking-widest',
            label === 'WIN' ? playerAccentClasses(isP1) : 'text-red-400',
          )}
        >
          {isP1 ? 'PA' : 'PB'} {label}
        </p>
        <p className="truncate text-base font-semibold text-foreground">{player.nickname}</p>
      </div>
      <span
        className={cn(
          'flex-shrink-0 font-display text-4xl font-black tabular-nums leading-none',
          playerAccentClasses(isP1),
        )}
      >
        {sets}
      </span>
    </div>
  )
}

export function WinnerHeroCard({ game }: Props) {
  const isP1Winner = game.winnerId === game.player1.id
  const winner = isP1Winner ? game.player1 : game.player2
  const loser = isP1Winner ? game.player2 : game.player1
  const isWinnerP1 = isP1Winner

  const completedSets = game.sets.filter((s) => s.completedAt != null)
  const p1Sets = completedSets.filter((s) => s.player1Score > s.player2Score).length
  const p2Sets = completedSets.filter((s) => s.player2Score > s.player1Score).length
  const winnerSets = isP1Winner ? p1Sets : p2Sets
  const loserSets = isP1Winner ? p2Sets : p1Sets

  const setBySet = completedSets.map((s) => `${s.player1Score}–${s.player2Score}`).join(' · ')

  return (
    <div className="rounded-xl border bg-card ring-1 ring-primary/20 overflow-hidden">
      {/* TOP: centered content */}
      <div className="flex flex-col items-center text-center gap-6 p-8 sm:p-12">
        {/* WINNER badge with crown icons */}
        <div className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-1.5 shadow-[0_0_32px_rgb(255_91_31/0.55)]">
          <Crown className="h-3.5 w-3.5 text-primary-foreground" />
          <span className="font-display text-[13px] uppercase tracking-[0.24em] text-primary-foreground">
            ПОБЕДИТЕЛЬ
          </span>
          <Crown className="h-3.5 w-3.5 text-primary-foreground" />
        </div>

        {/* AVATAR with halo */}
        <div className="relative">
          <div
            className="absolute inset-[-8px] rounded-md border-2 border-current opacity-35"
            style={{ color: isWinnerP1 ? '#ff5b1f' : '#3b82f6' }}
          />
          <div
            className={cn(
              'relative flex h-[104px] w-[104px] items-center justify-center rounded-md font-display text-5xl font-black',
              playerTileClasses(isWinnerP1),
            )}
          >
            {initials(winner.nickname)}
          </div>
        </div>

        {/* PLAYER label */}
        <p
          className={cn(
            'text-[11px] font-display uppercase tracking-[0.24em]',
            playerAccentClasses(isWinnerP1),
          )}
        >
          {isWinnerP1 ? 'PLAYER A' : 'PLAYER B'} · WIN
        </p>

        {/* WINNER NAME */}
        <h1 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl md:text-8xl">
          {winner.nickname.toUpperCase()}
        </h1>

        {/* FINAL SCORE pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 rounded-md border bg-popover px-6 py-3.5">
          <span className="font-display text-[11px] uppercase tracking-widest text-muted-foreground">
            ФИНАЛЬНЫЙ СЧЁТ
          </span>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'font-display text-[28px] font-black tabular-nums leading-none',
                playerAccentClasses(isWinnerP1),
              )}
            >
              {winnerSets}
            </span>
            <span className="font-display text-lg font-black leading-none text-muted-foreground">
              :
            </span>
            <span className="font-display text-[28px] font-black tabular-nums leading-none text-muted-foreground">
              {loserSets}
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] tabular-nums text-muted-foreground">
            {setBySet}
          </span>
        </div>
      </div>

      {/* BOTTOM: VS strip */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-t bg-background/40 px-6 py-5">
        {/* Winner side (left, right-aligned) */}
        <PlayerLine player={winner} isP1={isWinnerP1} sets={winnerSets} label="WIN" align="right" />
        {/* Center VS */}
        <span className="font-display text-sm uppercase tracking-[0.18em] text-muted-foreground">
          vs
        </span>
        {/* Loser side (right, left-aligned, dimmed) */}
        <div className="opacity-55">
          <PlayerLine
            player={loser}
            isP1={!isWinnerP1}
            sets={loserSets}
            label="LOSS"
            align="left"
          />
        </div>
      </div>
    </div>
  )
}
