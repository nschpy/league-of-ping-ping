import { Outlet } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { HeroPanel } from './components/HeroPanel'
import { ThemeToggle } from '@/components/ThemeToggle'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex relative" style={{ background: 'var(--color-background)' }}>
      <ThemeToggle className="absolute top-4 right-4 z-10" />
      <HeroPanel />
      <div className="flex-1 flex flex-col items-center lg:items-stretch justify-center px-5 sm:px-10 lg:px-14 py-10 lg:py-16 min-w-0">
        <Logo className="lg:hidden mb-10" />
        <Outlet />
      </div>
    </div>
  )
}
