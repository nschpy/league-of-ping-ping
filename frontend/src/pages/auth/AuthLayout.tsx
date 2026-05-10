import { Outlet } from 'react-router-dom'
import { HeroPanel } from './components/HeroPanel'

export function AuthLayout() {
  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--color-background)' }}>
      <HeroPanel />
      <div className="flex-1 flex flex-col justify-center overflow-y-auto px-5 sm:px-10 lg:px-14 py-16 relative min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
