"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


const UNREAD_ORDERS = 2

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard",      badge: 0 },
  { href: "/clients",   label: "Clients",   icon: "person_book",    badge: 0 },
  { href: "/orders",    label: "Orders",    icon: "receipt_long",   badge: UNREAD_ORDERS },
  { href: "/collections", label: "Collections", icon: "inventory_2", badge: 0 },
  { href: "/inbox", label: "Inbox", icon: "message",    badge: 0 },
  { href: "/tailors",   label: "Tailors",   icon: "groups",         badge: 0 },
  { href: "/agent",     label: "AI Agent",  icon: "magic_button",   badge: 0 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0  h-full z-40 hidden md:flex flex-col py-8 px-2 w-24 pt-34 bg-surface-container-low borer-r justify-center items-center border-outline-variant">
      {/* Studio identity */}
      {/* <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-primary text-lg">checkroom</span>
        </div>
        <div>
          <p className="text-label-caps font-label-caps text-primary">ThreadFlow AI</p>
          <p className="text-body-sm font-body-sm text-on-surface-variant">Studio Manager</p>
        </div>
      </div> */}

      {/* Nav */}
      <nav className="flex flex-col items-cente gap-2 grow">
        {navItems.map(({ href, label, icon, badge }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 py-3 px-1 transition-all duration-200 ${
                isActive
                  ? "text-primary font-bold border-r-2 border-primary bg-surface-container-high translate-x-1"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <div>
                   <span className="material-symbols-outlined text-[]">{icon}</span>
              <span className="text-sidebar-icon pt-0.5 font-label-caps block ">{label}</span>
              </div>
             
              {badge > 0 && (
                <span className="bg-primary text-on-primary text-[6px] font-label-caps font-semibold w-2 h-2 flex items-center justify-center shrink-0">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User row */}
      {/* <div className="mt-auto pt-6 border-t border-outline-variant">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-9 h-9 bg-surface-container-highest flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-sm text-on-surface-variant">person</span>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-primary">Taiwo</p>
            <p className="text-body-sm font-body-sm text-on-surface-variant">Studio Manager</p>
          </div>
        </div>
      </div> */}
    </aside>
  );
}