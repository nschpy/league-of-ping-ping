interface LogoProps { size?: number; className?: string }
export function Logo({ size = 28, className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect x="2" y="2" width="28" height="28" rx="6" stroke="var(--color-primary)" strokeWidth="2" />
        <circle cx="11" cy="11" r="3.5" fill="var(--color-primary)" />
        <path d="M14 14 L24 24" stroke="var(--color-primary)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="24" cy="24" r="2" fill="var(--color-foreground)" />
      </svg>
      <span
        style={{ fontFamily: 'var(--font-display)', fontSize: size * 0.62, letterSpacing: '0.04em' }}
        className="text-foreground uppercase leading-none"
      >
        League of Tennis
      </span>
    </div>
  )
}
