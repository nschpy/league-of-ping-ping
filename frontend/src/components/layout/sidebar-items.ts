export interface SidebarItem {
  key: string
  to: string
  label: string
  iconPath: string
}

export const sidebarItems: SidebarItem[] = [
  {
    key: 'dashboard',
    to: '/dashboard',
    label: 'Дашборд',
    iconPath: 'M3 12h7V3H3v9zm0 9h7v-7H3v7zm9 0h7v-9h-7v9zm0-18v7h7V3h-7z',
  },
  {
    key: 'play',
    to: '/games/new',
    label: 'Создать игру',
    iconPath: 'M8 5v14l11-7z',
  },
  {
    key: 'matches',
    to: '/matches',
    label: 'Матчи',
    iconPath: 'M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z',
  },
]
