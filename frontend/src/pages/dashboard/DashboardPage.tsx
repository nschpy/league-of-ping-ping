import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <h1
        style={{ fontFamily: 'var(--font-display)', fontSize: 48, letterSpacing: '0.02em' }}
        className="uppercase text-foreground"
      >
        Привет, <span className="text-primary">{user?.nickname}</span>
      </h1>
      <p className="text-muted-foreground text-[15px]">
        MMR: <span style={{ fontFamily: 'var(--font-mono)' }} className="text-foreground">{user?.mmr ?? 1000}</span>
      </p>
      <p className="text-muted-foreground/50 text-[13px] mt-4">Dashboard coming soon</p>
    </div>
  )
}
