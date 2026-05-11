import type { GameFormat } from '@/lib/types'
import { FormatCard } from './FormatCard'

const FORMATS: GameFormat[] = ['bo1', 'bo3', 'bo5']

interface FormatSectionProps {
  selected: GameFormat | null
  onSelect: (f: GameFormat) => void
}

export function FormatSection({ selected, onSelect }: FormatSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        2. Формат
      </p>
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
