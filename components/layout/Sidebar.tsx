"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from '@/app/constants/navigation'
import { User } from 'lucide-react'


export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full z-40 hidden md:flex flex-col py-8 px-6 w-64 pt-24 bg-surface-container-low border-r border-outline-variant">
      {/* Studio identity */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-surface-container-highest flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-surface-variant"><User /></span>
        </div>
        <div>
          <p className="text-label-caps font-label-caps text-primary">Fashion Studio</p>
          <p className="text-body-sm font-body-sm text-on-surface-variant">Manager Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 grow">
        {navItems.map(({ href, label, icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === href || pathname.startsWith(href + "/");

              const Icon = icon

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 py-3 px-4 transition-all duration-200 ${
                isActive
                  ? "text-primary font-bold border-r-2 border-primary bg-surface-container-high translate-x-1"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined"><Icon /></span>
              <span className="text-label-caps font-label-caps">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User row */}
      <div className="mt-auto pt-6 border-t border-outline-variant">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-sm text-on-surface-variant"><User /></span>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-primary">Taiwo</p>
            <p className="text-body-sm font-body-sm text-on-surface-variant">Studio Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}