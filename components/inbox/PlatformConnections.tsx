'use client'

import { useState } from 'react'
import { ConnectPlatformModal } from './ConnectPlatformModal'
import { ConnectWebsiteModal } from './ConnectWebsiteModal'

type PlatformId = 'instagram' | 'whatsapp' | 'facebook' | 'website'

interface PlatformConfig {
  id: PlatformId
  name: string
  description: string
  icon: string
  className: string
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Capture orders from DMs and story replies.',
    icon: 'photo_camera',
    className: 'bg-gradient-to-r from-pink-500 to-purple-600',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Read incoming order messages automatically.',
    icon: 'chat',
    className: 'bg-green-500',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Track orders from page messages and posts.',
    icon: 'thumb_up',
    className: 'bg-blue-600',
  },
  {
    id: 'website',
    name: 'Business Website',
    description: 'Capture orders submitted through your site.',
    icon: 'language',
    className: 'bg-gray-500',
  },
]

type ConnectionState = { connected: false } | { connected: true; url?: string }

export function PlatformConnections() {
  const [connections, setConnections] = useState<Record<PlatformId, ConnectionState>>({
    instagram: { connected: false },
    whatsapp: { connected: false },
    facebook: { connected: false },
    website: { connected: false },
  })
  const [connectingPlatform, setConnectingPlatform] = useState<PlatformConfig | null>(null)

  const connectedCount = Object.values(connections).filter((c) => c.connected).length

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
          Connected Platforms
        </h2>
        <span className="bg-surface-container text-on-surface-variant text-label-caps font-label-caps px-2 py-0.5 rounded-full">
          {connectedCount}/{PLATFORMS.length}
        </span>
      </div>
      <p className="text-body-sm font-body-sm text-on-surface-variant mb-6">
        Connect the channels you take orders through — messages will start landing in your inbox automatically.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLATFORMS.map((platform) => {
          const state = connections[platform.id]

          return (
            <div
              key={platform.id}
              className={`border bg-surface-container-lowest p-5 flex flex-col gap-4 transition-colors ${
                state.connected ? 'border-tertiary/50' : 'border-outline-variant'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${platform.className}`}>
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>
                    {platform.icon}
                  </span>
                </div>
                {state.connected && (
                  <span className="flex items-center gap-1 text-label-caps font-label-caps text-tertiary shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                    LIVE
                  </span>
                )}
              </div>

              <div>
                <p className="text-body-sm font-body-sm font-semibold text-primary">{platform.name}</p>
                <p className="text-label-caps font-label-caps text-on-surface-variant mt-1 leading-snug">
                  {platform.description}
                </p>
                {state.connected && state.url && (
                  <p className="text-label-caps font-label-caps text-on-surface-variant mt-1 truncate" title={state.url}>
                    {state.url}
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  state.connected
                    ? setConnections((prev) => ({ ...prev, [platform.id]: { connected: false } }))
                    : setConnectingPlatform(platform)
                }
                className={`mt-auto w-full py-2 text-label-caps font-label-caps tracking-widest transition-colors ${
                  state.connected
                    ? 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                    : 'bg-primary text-on-primary hover:opacity-90'
                }`}
              >
                {state.connected ? 'DISCONNECT' : 'CONNECT'}
              </button>
            </div>
          )
        })}
      </div>

      {connectingPlatform?.id === 'website' && (
        <ConnectWebsiteModal
          onClose={() => setConnectingPlatform(null)}
          onConnected={(url) => {
            setConnections((prev) => ({ ...prev, website: { connected: true, url } }))
            setConnectingPlatform(null)
          }}
        />
      )}

      {connectingPlatform && connectingPlatform.id !== 'website' && (
        <ConnectPlatformModal
          platform={connectingPlatform}
          onClose={() => setConnectingPlatform(null)}
          onConnected={() => {
            setConnections((prev) => ({ ...prev, [connectingPlatform.id]: { connected: true } }))
            setConnectingPlatform(null)
          }}
        />
      )}
    </section>
  )
}
