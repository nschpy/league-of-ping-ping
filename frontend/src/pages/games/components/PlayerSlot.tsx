import { cn } from '@/lib/utils'
import { initials } from '@/lib/player'
import type { PlayerSummary } from '@/lib/types'

interface PlayerSlotProps {
  player: PlayerSummary | null
  side: 'A' | 'B'
  label: string
  role: string
  onPick: () => void
}

interface StatProps {
  label: string
  value: string
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border/60 bg-background/40 px-3 py-2">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}

export function PlayerSlot({ player, side, label, role, onPick }: PlayerSlotProps) {
  const isA = side === 'A'
  const topBorder = isA ? 'border-t-primary' : 'border-t-blue-500'
  const topStripe = isA ? 'bg-primary' : 'bg-blue-500'
  const avatarBg = isA ? 'bg-primary text-primary-foreground' : 'bg-blue-500 text-white'

  if (!player) {
    return (
      <div
        className={cn(
          'flex min-h-[280px] flex-1 flex-col rounded-lg border border-dashed border-border bg-card/40',
          'border-t-2',
          topBorder,
        )}
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {role}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-md border border-dashed border-border text-xl text-muted-foreground">
            ?
          </div>
          <p className="text-sm text-muted-foreground">Игрок не выбран</p>
        </div>
        <div className="flex items-center justify-between border-t border-border/60 px-5 py-3">
          <span className="text-xs text-muted-foreground">сменить игрока</span>
          <button
            type="button"
            onClick={onPick}
            className="text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/80"
          >
            выбрать →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card',
      )}
    >
      <div aria-hidden className={cn('absolute inset-x-0 top-0 h-1', topStripe)} />
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {role}
        </span>
      </div>

      <div className="flex items-center gap-4 px-5 py-4">
        <div
          className={cn(
            'flex h-14 w-14 shrink-0 items-center justify-center rounded-md text-base font-bold',
            avatarBg,
          )}
        >
          {initials(player.nickname)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">{player.nickname}</p>
          <p className="truncate text-[11px] uppercase tracking-widest text-muted-foreground">
            RU · GOLD · —
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            MMR
          </span>
          <span className="font-display text-3xl leading-none text-foreground">
            {player.mmr}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-5 pb-4">
        <Stat label="Винрейт" value="—" />
        <Stat label="Матчей" value="—" />
        <Stat label="Серия" value="—" />
      </div>

      <div className="flex items-center justify-between border-t border-border/60 px-5 py-3">
        <button
          type="button"
          onClick={onPick}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          сменить игрока
        </button>
        <button
          type="button"
          onClick={onPick}
          className="text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/80"
        >
          выбрать →
        </button>
      </div>
    </div>
  )
}
