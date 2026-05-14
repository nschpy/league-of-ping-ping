import { CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDuration } from '@/lib/time'
import type { Game } from '@/lib/types'

interface Props {
  game: Game
}

interface ChronoBlockProps {
  label: string
  value: string
}

function ChronoBlock({ label, value }: ChronoBlockProps) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-mono text-sm tabular-nums text-foreground">{value}</span>
    </div>
  )
}

const formatChipLabel: Record<string, string> = { bo1: 'BO1', bo3: 'BO3', bo5: 'BO5' }

export function CompletedMetaRow({ game }: Props) {
  const startMs = new Date(game.startedAt).getTime()
  const endMs = game.completedAt ? new Date(game.completedAt).getTime() : Date.now()
  const durationStr = formatDuration(endMs - startMs)

  const totalPoints = game.sets.reduce((acc, s) => acc + s.points.length, 0)

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-3">
      {/* Left: status chips */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge className="border-success/40 bg-success/10 text-success">
          <CheckCircle className="h-3.5 w-3.5" />
          МАТЧ ЗАВЕРШЁН
        </Badge>
        <Badge className="border-border bg-card text-muted-foreground">
          MATCH #{game.id.slice(-5).toUpperCase()}
        </Badge>
        <Badge className="border-accent bg-transparent text-accent">
          {formatChipLabel[game.format] ?? game.format.toUpperCase()}
        </Badge>
        <Badge className="border-border bg-card text-muted-foreground">
          результат подтверждён
        </Badge>
      </div>

      {/* Right: metrics */}
      <div className="flex items-center gap-5">
        <ChronoBlock label="ОБЩЕЕ ВРЕМЯ" value={durationStr} />
        <ChronoBlock label="ОЧКОВ СЫГРАНО" value={String(totalPoints)} />
      </div>
    </div>
  )
}
