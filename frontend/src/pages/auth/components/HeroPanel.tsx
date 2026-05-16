import { Logo } from '@/components/Logo'
import { CourtIllustration } from './CourtIllustration'

const stats = [
  ['12,408', 'Игроков'],
  ['43,711', 'Матчей сыграно'],
  ['+25', 'MMR за победу'],
] as const

export function HeroPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between flex-[0_0_52%] relative px-14 py-10 border-r border-border overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--card), var(--background))' }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,91,31,.08), transparent 60%)' }}
      />
      <Logo />

      {/* Hero text + court SVG */}
      <div className="relative">
        <CourtIllustration />
        <h1
          style={{ fontFamily: 'var(--font-display)', fontSize: 72, lineHeight: 0.92, letterSpacing: '0.005em' }}
          className="uppercase text-foreground mb-5 relative"
        >
          Rule the<br />
          <span className="text-primary">Table.</span>
        </h1>
        <p className="text-muted-foreground text-[15px] leading-[1.55] max-w-[440px] relative">
          Соревновательная платформа по настольному теннису. Регистрируйся, играй матчи, поднимай MMR.
        </p>
      </div>

      {/* Stats */}
      <div className="flex relative">
        {stats.map(([num, label], i) => (
          <div key={label} className={`flex-1 ${i ? 'pl-4 border-l border-border' : 'pr-4'}`}>
            <div
              style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums' }}
              className="text-foreground"
            >
              {num}
            </div>
            <p
              style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em' }}
              className="uppercase text-muted-foreground mt-1"
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
