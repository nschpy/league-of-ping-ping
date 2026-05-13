import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MobileSidebar } from './MobileSidebar'
import { useAuthStore } from '@/stores/auth'

export function Topbar() {
  const { user, logout } = useAuthStore()

  return (
    <header className="h-16 border-b border-border flex items-center gap-3 px-4 bg-background">
      <MobileSidebar />

      {/* Search bar (non-functional) */}
      <div className="flex-1 max-w-sm hidden sm:flex items-center gap-2 h-9 px-3 rounded border border-border bg-card text-muted-foreground text-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
        </svg>
        Найти игрока, матч, турнир
      </div>

      <div className="flex-1" />

      {/* Create game button (desktop) */}
      <Button asChild size="sm" className="hidden md:flex">
        <Link to="/games/new">Создать игру</Link>
      </Button>

      {/* Bell */}
      <Button variant="ghost" size="icon">
        <Bell className="h-4 w-4" />
      </Button>

      {/* User avatar + dropdown */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {user.nickname.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium">{user.nickname}</div>
                <div className="text-xs text-muted-foreground font-mono">MMR {user.mmr}</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={logout} className="text-destructive">
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
