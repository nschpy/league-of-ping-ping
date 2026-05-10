export function CourtIllustration() {
  return (
    <svg
      viewBox="0 0 600 360"
      className="absolute inset-0 size-full pointer-events-none opacity-[0.18]"
      aria-hidden
    >
      <rect x="40" y="60" width="520" height="240" stroke="var(--color-primary)" strokeWidth="2" fill="none" />
      <line x1="300" y1="60" x2="300" y2="300" stroke="var(--color-primary)" strokeWidth="1.5" />
      <line x1="40" y1="180" x2="560" y2="180" stroke="var(--color-primary)" strokeWidth="1" opacity="0.5" />
      <circle cx="240" cy="140" r="6" fill="var(--color-primary)" />
      <path d="M250 145 L380 240" stroke="var(--color-primary)" strokeWidth="1.2" strokeDasharray="2 4" />
      <circle cx="380" cy="240" r="4" fill="var(--color-primary)" opacity="0.6" />
    </svg>
  )
}
