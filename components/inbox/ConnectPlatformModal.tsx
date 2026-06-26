'use client'

import { useEffect, useState } from 'react'

type StepKey = 'redirecting' | 'authorizing' | 'verifying' | 'done'

const STEPS: { key: StepKey; label: string; durationMs: number }[] = [
  { key: 'redirecting', label: 'Redirecting to {platform}…', durationMs: 1100 },
  { key: 'authorizing', label: 'Waiting for your approval…', durationMs: 1700 },
  { key: 'verifying', label: 'Verifying account…', durationMs: 1000 },
  { key: 'done', label: 'Connected', durationMs: 0 },
]

const PERMISSIONS = ['Read direct messages', 'View basic profile info', 'Send messages on your behalf']

export function ConnectPlatformModal({
  platform,
  onClose,
  onConnected,
}: {
  platform: { id: string; name: string; icon: string; className: string }
  onClose: () => void
  onConnected: () => void
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const isDone = STEPS[stepIndex].key === 'done'

  useEffect(() => {
    if (isDone) return
    const timer = setTimeout(() => setStepIndex((i) => i + 1), STEPS[stepIndex].durationMs)
    return () => clearTimeout(timer)
  }, [stepIndex, isDone])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant shadow-2xl">
        <div className="flex flex-col items-center text-center gap-5 px-8 py-10">
          <div className={`w-14 h-14 flex items-center justify-center shrink-0 ${platform.className}`}>
            <span className="material-symbols-outlined text-white text-2xl">{platform.icon}</span>
          </div>

          {!isDone ? (
            <>
              <div>
                <p className="text-body-lg font-body-lg text-primary font-semibold mb-1">
                  Connecting to {platform.name}
                </p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  {STEPS[stepIndex].label.replace('{platform}', platform.name)}
                </p>
              </div>

              {STEPS[stepIndex].key === 'authorizing' && (
                <div className="w-full border border-outline-variant bg-surface-container-low px-4 py-3 text-left">
                  <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-2">
                    ThreadFlow AI is requesting access to:
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {PERMISSIONS.map((permission) => (
                      <li key={permission} className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface">
                        <span className="material-symbols-outlined text-tertiary" style={{ fontSize: '16px' }}>
                          check
                        </span>
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <span className="material-symbols-outlined text-on-surface-variant animate-spin">progress_activity</span>
            </>
          ) : (
            <>
              <div>
                <p className="text-body-lg font-body-lg text-primary font-semibold mb-1">
                  Connected to {platform.name}
                </p>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  New messages from {platform.name} will now appear in your inbox.
                </p>
              </div>
              <span
                className="material-symbols-outlined text-tertiary text-3xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                check_circle
              </span>
              <button
                onClick={onConnected}
                className="w-full bg-primary text-on-primary py-2.5 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
              >
                DONE
              </button>
            </>
          )}
        </div>

        {!isDone && (
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
