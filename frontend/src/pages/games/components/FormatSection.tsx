import type { GameFormat } from '@/lib/types'
import { FormatCard } from './FormatCard'

const FORMATS: GameFormat[] = ['bo1', 'bo3', 'bo5']

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

interface FormatSectionProps {
  selected: GameFormat | null
  onSelect: (f: GameFormat) => void
}

export function FormatSection({ selected, onSelect }: FormatSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          2. Формат
        </p>
        {selected && (
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            выбран ·{' '}
            <span className="text-foreground">{FORMAT_LABELS[selected]}</span>{' '}
            <span className="normal-case tracking-normal">
              ({FORMAT_SUBTITLES[selected]})
            </span>
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {FORMATS.map((f) => (
          <FormatCard
            key={f}
            format={f}
            selected={selected === f}
            onSelect={() => onSelect(f)}
          />
        ))}
      </div>
    </div>
  )
}
