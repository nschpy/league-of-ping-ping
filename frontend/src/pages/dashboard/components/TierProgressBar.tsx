interface TierProgressBarProps {
  progress: number
}

export function TierProgressBar({ progress }: TierProgressBarProps) {
  const pct = Math.min(1, Math.max(0, progress)) * 100

  return (
    <div className="relative h-[6px] rounded-full bg-secondary overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          className="absolute inset-y-0 w-px bg-background/60"
          style={{ left: `${(i + 1) * 10}%` }}
        />
      ))}
    </div>
  )
}
