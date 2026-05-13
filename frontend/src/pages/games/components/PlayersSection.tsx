import type { PlayerSummary } from '@/lib/types'
import { PlayerSlot } from './PlayerSlot'

interface PlayersSectionProps {
  player1: PlayerSummary | null
  player2: PlayerSummary | null
  onPickPlayer1: () => void
  onPickPlayer2: () => void
}

export function PlayersSection({
  player1,
  player2,
  onPickPlayer1,
  onPickPlayer2,
}: PlayersSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        1. Участники
      </p>
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PlayerSlot
          player={player1}
          side="A"
          label="PLAYER A"
          role="подача"
          onPick={onPickPlayer1}
        />

        <PlayerSlot
          player={player2}
          side="B"
          label="PLAYER B"
          role="приём"
          onPick={onPickPlayer2}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-[11px] font-bold tracking-widest text-muted-foreground shadow-md">
            VS
          </span>
        </div>
      </div>
    </div>
  )
}
