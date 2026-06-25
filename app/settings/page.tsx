import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
}

export default function SettingsPage() {
  return (
    <main className="px-10 py-10 pb-16">
      <header className="mb-10">
        <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
          Studio
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Settings</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
          Studio preferences, integrations, and account settings.
        </p>
      </header>

      <div className="border border-outline-variant bg-surface-container-lowest px-6 py-16 text-center">
        <span className="material-symbols-outlined text-on-surface-variant text-3xl mb-3 block">construction</span>
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Settings are coming soon — studio name, platform connections, and team access will live here.
        </p>
      </div>
    </main>
  )
}
