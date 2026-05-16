import { cn } from '@/lib/utils'

interface StatRowProps {
  label: string
  value: React.ReactNode
  sub?: string
  valueClassName?: string
}

export function StatRow({ label, value, sub, valueClassName }: StatRowProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-muted-foreground text-[11px] font-mono uppercase tracking-widest">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span
          style={{ fontFamily: 'var(--font-display)' }}
          className={cn('text-foreground text-[32px] leading-none', valueClassName)}
        >
          {value}
        </span>
        {sub && (
          <span className="text-muted-foreground text-[12px] font-mono">{sub}</span>
        )}
      </div>
    </div>
  )
}
