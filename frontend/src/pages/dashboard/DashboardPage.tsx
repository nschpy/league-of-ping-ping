import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    void navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-background)' }}>
      <header className="flex items-center justify-between px-8 py-4 border-b border-border">
        <Logo size={24} />
        <Button variant="outline" onClick={handleLogout} className="h-9 text-[13px] uppercase tracking-[0.08em]" style={{ fontFamily: 'var(--font-display)' }}>
          Выйти
        </Button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center gap-4">
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
      </main>
    </div>
  )
}
