'use client'

import { useState } from 'react'

type Phase = 'input' | 'checking' | 'installing' | 'done'

export function ConnectWebsiteModal({
  onClose,
  onConnected,
}: {
  onClose: () => void
  onConnected: (url: string) => void
}) {
  const [url, setUrl] = useState('')
  const [phase, setPhase] = useState<Phase>('input')
  const [error, setError] = useState<string | null>(null)

  const normalizedUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmed = url.trim()

    if (!trimmed) {
      setError('Enter your website URL first.')
      return
    }
    if (!/^[\w-]+(\.[\w-]+)+/i.test(trimmed.replace(/^https?:\/\//i, ''))) {
      setError("That doesn't look like a valid website address.")
      return
    }

    setPhase('checking')
    setTimeout(() => setPhase('installing'), 1300)
    setTimeout(() => setPhase('done'), 2700)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && phase === 'input') onClose()
      }}
    >
      <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant shadow-2xl">
        <div className="flex flex-col items-center text-center gap-5 px-8 py-10">
          <div className="w-14 h-14 flex items-center justify-center shrink-0 bg-gray-500">
            <span className="material-symbols-outlined text-white text-2xl">language</span>
          </div>

          {phase === 'input' && (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div>
                <p className="text-body-lg font-body-lg text-primary font-semibold mb-1">Connect Your Website</p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Enter your order form or booking page URL.
                </p>
              </div>
              {error && <p className="text-body-sm font-body-sm text-urgent">{error}</p>}
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourstudio.com"
                autoFocus
                className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 text-body-lg font-body-lg text-on-surface placeholder:text-outline-variant transition-colors text-center"
              />
              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-2.5 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
              >
                VERIFY & CONNECT
              </button>
            </form>
          )}

          {(phase === 'checking' || phase === 'installing') && (
            <>
              <div>
                <p className="text-body-lg font-body-lg text-primary font-semibold mb-1">
                  {phase === 'checking' ? 'Checking your website…' : 'Installing ThreadFlow snippet…'}
                </p>
                <p className="text-body-sm font-body-sm text-on-surface-variant break-all">{normalizedUrl}</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant animate-spin">progress_activity</span>
            </>
          )}

          {phase === 'done' && (
            <>
              <div>
                <p className="text-body-lg font-body-lg text-primary font-semibold mb-1">Website Connected</p>
                <p className="text-body-sm font-body-sm text-on-surface-variant break-all">
                  Orders submitted through {normalizedUrl} will now appear in your inbox.
                </p>
              </div>
              <span
                className="material-symbols-outlined text-tertiary text-3xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                check_circle
              </span>
              <button
                onClick={() => onConnected(normalizedUrl)}
                className="w-full bg-primary text-on-primary py-2.5 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
              >
                DONE
              </button>
            </>
          )}
        </div>

        {phase === 'input' && (
          <div className="border-t border-outline-variant px-8 py-4 text-center">
            <button
              onClick={onClose}
              className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors"
            >
              CANCEL
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
