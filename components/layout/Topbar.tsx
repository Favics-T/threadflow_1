"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, User, Sparkle, Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-items";

export default function TopNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-2 bg-surface-container-low backdrop-blur-md border-b border-outline-variant">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
          aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMobileNavOpen((open) => !open)}
        >
          {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link href="/" className="font-display-lg text-xl text-primary tracking-tight">
          ThreadFlow AI
        </Link>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <button
          className="text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined"><Bell /></span>
        </button>
        <button
          className="text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Account"
        >
          <span className="material-symbols-outlined"><User /></span>
        </button>
        <Link
          href="/agent"
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[8px]"><Sparkle /></span>
          ASK AI
        </Link>
      </div>

      {/* Mobile nav drawer */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 top-[52px] z-50 md:hidden bg-black/30 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMobileNavOpen(false);
          }}
        >
          <nav className="bg-surface-container-lowest border-b border-outline-variant shadow-xl flex flex-col">
            {NAV_ITEMS.map(({ href, label, icon, special }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              const badge = href === "/inbox" ? unreadCount : 0;

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-6 py-4 border-b border-outline-variant text-body-sm font-body-sm transition-colors ${
                    isActive
                      ? "text-primary font-semibold bg-surface-container-high"
                      : special
                      ? "text-tertiary bg-tertiary-fixed/20"
                      : "text-on-surface-variant"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={special ? { fontVariationSettings: '"FILL" 1' } : undefined}
                  >
                    {icon}
                  </span>
                  {label}
                  {badge > 0 && (
                    <span className="ml-auto bg-urgent text-white text-[10px] font-label-caps font-semibold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
