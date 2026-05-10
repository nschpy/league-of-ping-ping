interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="1" y="1" width="30" height="30" rx="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="14" r="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="21" x2="16" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="9" r="2" fill="currentColor" />
    </svg>
  )
}
