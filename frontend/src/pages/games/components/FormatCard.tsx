import { cn } from '@/lib/utils'
import type { GameFormat } from '@/lib/types'

const FORMAT_LABELS: Record<GameFormat, string> = {
  bo1: 'BO1',
  bo3: 'BO3',
  bo5: 'BO5',
}

const FORMAT_SUBTITLES: Record<GameFormat, string> = {
  bo1: '1 сет — быстрая дуэль',
  bo3: 'до 2 побед в сетах',
  bo5: 'до 3 побед — серьёзная серия',
}

const FORMAT_BARS: Record<GameFormat, number> = {
  bo1: 1,
  bo3: 3,
  bo5: 5,
}

interface FormatCardProps {
  format: GameFormat
  selected: boolean
  onSelect: () => void
}

export function FormatCard({ format, selected, onSelect }: FormatCardProps) {
  const bars = FORMAT_BARS[format]

  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative flex flex-col gap-3 rounded-lg border p-4 text-left transition-colors',
        selected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card hover:border-primary/50',
      )}
    >
      {format === 'bo3' && (
        <span className="absolute right-3 top-3 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
          Popular
        </span>
      )}

      <div className="font-display text-3xl font-bold text-foreground">
        {FORMAT_LABELS[format]}
      </div>

      <p className="text-xs text-muted-foreground">{FORMAT_SUBTITLES[format]}</p>

      <div className="flex gap-1">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full',
              selected ? 'bg-primary' : 'bg-muted-foreground/30',
            )}
          />
        ))}
      </div>
    </button>
  )
}
