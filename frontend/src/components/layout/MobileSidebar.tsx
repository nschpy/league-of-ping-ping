import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from '@/components/Logo'
import { sidebarItems } from './sidebar-items'
import { SidebarItem } from './SidebarItem'
import { Button } from '@/components/ui/button'

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[220px] p-0">
        <div className="px-3 py-5 border-b border-border">
          <Logo size={24} />
        </div>
        <div className="px-3 py-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-2 py-1 mb-1">
            навигация
          </p>
          <nav className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <SidebarItem key={item.key} item={item} />
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
