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
      <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        1. Игроки
      </p>
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <PlayerSlot
          player={player1}
          side="A"
          label="PLAYER A"
          onPick={onPickPlayer1}
        />

        <div className="flex items-center justify-center sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-muted-foreground ring-2 ring-background">
            VS
          </span>
        </div>

        <PlayerSlot
          player={player2}
          side="B"
          label="PLAYER B"
          onPick={onPickPlayer2}
        />
      </div>
    </div>
  )
}
