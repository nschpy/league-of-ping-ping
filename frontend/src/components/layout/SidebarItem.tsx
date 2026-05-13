import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { SidebarItem as SidebarItemType } from './sidebar-items'

interface Props {
  item: SidebarItemType
}

export function SidebarItem({ item }: Props) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors',
          isActive
            ? 'bg-primary/10 text-primary font-semibold'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
        )
      }
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d={item.iconPath} />
      </svg>
      {item.label}
    </NavLink>
  )
}
