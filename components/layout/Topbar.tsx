"use client";

import Link from "next/link";
import {Bell,User,Sparkle } from 'lucide-react'

export default function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-20 px-10 bg-background/80 backdrop-blur-md border- shadow bordr-outline-variant">
      {/* Brand */}
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="font-display-lg text-2xl text-primary tracking-tight">
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
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm"><Sparkle /></span>
          ASK AI
        </Link>
      </div>
    </header>
  );
}