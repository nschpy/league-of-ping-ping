import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { PlayerSummary } from '@/lib/types'

interface PlayerSlotProps {
  player: PlayerSummary | null
  side: 'A' | 'B'
  label: string
  onPick: () => void
}

function initials(nickname: string): string {
  return nickname.slice(0, 2).toUpperCase()
}

export function PlayerSlot({ player, side, label, onPick }: PlayerSlotProps) {
  const isA = side === 'A'
  const topBorder = isA ? 'border-t-primary' : 'border-t-blue-500'
  const avatarBg = isA ? 'bg-primary text-primary-foreground' : 'bg-blue-500 text-white'

  if (!player) {
    return (
      <div
        className={cn(
          'flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border p-8',
          'border-t-2',
          topBorder,
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <Button variant="outline" onClick={onPick} size="sm">
          выбрать игрока
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-1 flex-col rounded-lg border border-border bg-card overflow-hidden',
        'border-t-2',
        topBorder,
      )}
    >
      <div className="flex flex-col items-center gap-3 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold',
            avatarBg,
          )}
        >
          {initials(player.nickname)}
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">{player.nickname}</p>
          <p className="text-sm text-muted-foreground">{player.mmr} MMR</p>
        </div>
      </div>
      <div className="border-t border-border px-6 py-3 text-center">
        <button
          onClick={onPick}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          сменить игрока
        </button>
      </div>
    </div>
  )
}
