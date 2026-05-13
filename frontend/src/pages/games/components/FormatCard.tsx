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
  const isPopular = format === 'bo3'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative flex min-h-[140px] flex-col justify-between gap-4 rounded-lg border p-5 text-left transition-colors',
        selected
          ? 'border-primary bg-primary/[0.07] ring-1 ring-primary/60'
          : 'border-border bg-card hover:border-primary/40',
      )}
    >
      {isPopular && (
        <span className="absolute -top-2.5 right-4 rounded-sm bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent-foreground shadow-sm">
          Popular
        </span>
      )}

      <div className="flex flex-col gap-1.5">
        <div
          className={cn(
            'font-display text-4xl font-bold leading-none',
            selected ? 'text-primary' : 'text-foreground',
          )}
        >
          {FORMAT_LABELS[format]}
        </div>
        <p className="text-xs text-muted-foreground">
          {FORMAT_SUBTITLES[format]}
        </p>
      </div>

      <div className="flex gap-1.5">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full',
              selected ? 'bg-primary' : 'bg-muted-foreground/20',
            )}
          />
        ))}
      </div>
    </button>
  )
}
