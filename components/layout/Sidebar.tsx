"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


const UNREAD_ORDERS = 2

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard",      badge: 0 },
  { href: "/clients",   label: "Clients",   icon: "person_book",    badge: 0 },
  { href: "/orders",    label: "Orders",    icon: "receipt_long",   badge: UNREAD_ORDERS },
  { href: "/inventory", label: "Inventory", icon: "inventory_2",    badge: 0 },
  { href: "/tailors",   label: "Tailors",   icon: "groups",         badge: 0 },
  { href: "/agent",     label: "AI Agent",  icon: "magic_button",   badge: 0 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full z-40 hidden md:flex flex-col py-8 px-6 w-64 pt-24 bg-surface-container-low border-r border-outline-variant">
      {/* Studio identity */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-on-primary text-lg">checkroom</span>
        </div>
        <div>
          <p className="text-label-caps font-label-caps text-primary">ThreadFlow AI</p>
          <p className="text-body-sm font-body-sm text-on-surface-variant">Studio Manager</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map(({ href, label, icon, badge }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === href || pathname.startsWith(href + "/");

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
              <span className="material-symbols-outlined">{icon}</span>
              <span className="text-label-caps font-label-caps flex-1">{label}</span>
              {badge > 0 && (
                <span className="bg-primary text-on-primary text-[10px] font-label-caps font-semibold w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User row */}
      <div className="mt-auto pt-6 border-t border-outline-variant">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-9 h-9 bg-surface-container-highest flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-sm text-on-surface-variant">person</span>
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