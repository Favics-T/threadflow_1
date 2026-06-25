"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav-items";

export default function Sidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full z-40 hidden md:flex flex-col items-center py-8 px-2 w-24 pt-[68px] bg-surface-container-low border-r border-outline-variant">
      <Link href="/" className="flex flex-col items-center gap-1.5 mb-8 pt-2">
        <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-primary text-lg">checkroom</span>
        </div>
        <span className="text-[9px] font-label-caps text-primary tracking-widest">THREADFLOW</span>
      </Link>

      <nav className="flex flex-col items-center gap-2 grow w-full">
        {NAV_ITEMS.map(({ href, label, icon, special }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          const badge = href === "/inbox" ? unreadCount : 0;

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-1 py-3 px-1 w-full transition-all duration-200 ${
                isActive
                  ? "text-primary font-bold border-r-2 border-primary bg-surface-container-high"
                  : special
                  ? "text-tertiary bg-tertiary-fixed/20 hover:bg-tertiary-fixed/40"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={special ? { fontVariationSettings: '"FILL" 1' } : undefined}
              >
                {icon}
              </span>
              <span className="text-sidebar-icon pt-0.5 font-label-caps block text-center">{label}</span>

              {badge > 0 && (
                <span className="absolute top-1 right-3 bg-urgent text-white text-[9px] font-label-caps font-semibold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
