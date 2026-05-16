import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TabValue = 'all' | 'win' | 'loss'

interface MatchesTabsProps {
  active: TabValue
  onChange: (v: TabValue) => void
}

const TABS: { label: string; value: TabValue }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Победы', value: 'win' },
  { label: 'Поражения', value: 'loss' },
]

export function MatchesTabs({ active, onChange }: MatchesTabsProps) {
  return (
    <div className="flex gap-1">
      {TABS.map(({ label, value }) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          onClick={() => onChange(value)}
          className={cn(
            active === value
              ? 'bg-primary/10 text-primary border border-primary/40'
              : '',
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
