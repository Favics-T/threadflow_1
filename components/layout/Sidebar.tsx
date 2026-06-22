'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItemConfig = {
  href: string
  label: string
  icon: string
  badge?: number
  badgeVariant?: 'info' | 'danger'
}

const navItems: NavItemConfig[] = [
  { href: '/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { href: '/clients', label: 'Clients', icon: 'users' },
  { href: '/orders', label: 'Orders', icon: 'clipboard-list', badge: 2, badgeVariant: 'info' },
  { href: '/inventory', label: 'Inventory', icon: 'stack', badge: 1, badgeVariant: 'danger' },
]

const teamItems = [
  { href: '/tailors', label: 'Tailors', icon: 'shirt' },
  { href: '/agent', label: 'AI Agent', icon: 'robot' },
  { href: '/reports', label: 'Reports', icon: 'report-analytics' },
]

interface BadgeVariant { variant?: 'info' | 'danger' }

function NavBadge({ count, variant }: { count: number } & BadgeVariant) {
  const styles: Record<string, string> = {
    info: 'bg-blue-50 text-blue-700',
    danger: 'bg-red-50 text-red-700',
  }
  return (
    <span className={`ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full ${styles[variant ?? 'info']}`}>
      {count}
    </span>
  )
}

function NavItem({
  href,
  label,
  icon,
  badge,
  badgeVariant,
  active,
}: {
  href: string
  label: string
  icon: string
  badge?: number
  badgeVariant?: 'info' | 'danger'
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5
        ${active
          ? 'bg-emerald-50 text-emerald-800 font-medium'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
        }`}
    >
      <i className={`ti ti-${icon} text-base ${active ? 'text-emerald-600' : ''}`} aria-hidden="true" />
      {label}
      {badge !== undefined && badgeVariant && (
        <NavBadge count={badge} variant={badgeVariant} />
      )}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[200px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col py-5">
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 pb-6">
        <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
          <i className="ti ti-needle-thread text-white text-sm" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold text-gray-900">
          Thread<span className="text-emerald-500">Flow</span>
        </span>
      </div>

      {/* Primary nav */}
      <nav className="px-3 mb-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href}
          />
        ))}
      </nav>

      {/* Team section */}
      <nav className="px-3 mt-2">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest px-2 mb-1.5">Team</p>
        {teamItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="mt-auto border-t border-gray-100 pt-3 px-3">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors mb-1"
        >
          <i className="ti ti-settings text-base" aria-hidden="true" />
          Settings
        </Link>
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[11px] font-medium text-emerald-800 flex-shrink-0">
            TW
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">Taiwo</p>
            <p className="text-[11px] text-gray-400">Manager</p>
          </div>
        </div>
      </div>
    </aside>
  )
}