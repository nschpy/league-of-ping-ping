import { Logo } from '@/components/Logo'
import { sidebarItems } from './sidebar-items'
import { SidebarItem } from './SidebarItem'

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-[220px] flex-shrink-0 border-r border-border bg-card min-h-screen">
      <div className="px-3 py-5">
        <Logo size={24} />
      </div>
      <div className="px-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-2 py-1 mb-1">
          навигация
        </p>
        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <SidebarItem key={item.key} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  )
}
