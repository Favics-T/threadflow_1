export interface NavItem {
  href: string
  label: string
  icon: string
  special?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/inbox', label: 'Inbox', icon: 'message' },
  { href: '/orders', label: 'Orders', icon: 'receipt_long' },
  { href: '/collections', label: 'Collections', icon: 'inventory_2' },
  { href: '/tailors', label: 'Tailors', icon: 'groups' },
  { href: '/brief', label: 'Brief Me', icon: 'auto_awesome', special: true },
  { href: '/settings', label: 'Settings', icon: 'settings' },
]
