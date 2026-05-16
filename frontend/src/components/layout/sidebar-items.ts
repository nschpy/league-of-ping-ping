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
  {
    key: 'profile',
    to: '/profile',
    label: 'Профиль',
    iconPath: 'M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z',
  },
]
