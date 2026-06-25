'use client'
import { Languages, SwitchCamera } from 'lucide-react'
import { FaFacebook, FaWhatsapp } from "react-icons/fa6";

import { ReactNode, useState } from 'react'
import { BsTwitter, BsWhatsapp } from 'react-icons/bs';

type Platform = {
  id: string
  name: string
  description: string
  icon: ReactNode | string
  color: string
  connected: boolean
}

const platforms: Platform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Capture orders from DMs and story replies',
    icon: <SwitchCamera /> ,
    color: '#E1306C',
    connected: true,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Read incoming order messages automatically',
    icon: <BsWhatsapp />,
    color: '#25D366',
    connected: false,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Track orders from page messages and posts',
    icon: <FaFacebook />,
    color: '#1877F2',
    connected: false,
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    description: 'Monitor mentions and DMs for order requests',
    icon: <BsTwitter />,
    color: '#000000',
    connected: false,
  },
  {
    id: 'website',
    name: 'Business Website',
    description: 'Connect your order form or booking page',
    icon: <Languages />,
    color: '#4F46E5',
    connected: true,
  },
]

export function PlatformConnections() {
  const [platformStates, setPlatformStates] = useState(
    Object.fromEntries(platforms.map((p) => [p.id, p.connected]))
  )
  const [connecting, setConnecting] = useState<string | null>(null)

  function handleToggle(id: string) {
    if (platformStates[id]) {
      setPlatformStates((prev) => ({ ...prev, [id]: false }))
      return
    }
    setConnecting(id)
    setTimeout(() => {
      setPlatformStates((prev) => ({ ...prev, [id]: true }))
      setConnecting(null)
    }, 1500)
  }

  const connectedCount = Object.values(platformStates).filter(Boolean).length

  return (
    <section className="mb-12">
      <div className="flex flex-col gap-3 mb-6">
        <div>
          <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-1">
            Connected Platforms
          </h2>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            {connectedCount} of {platforms.length} platforms connected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surface-container px-2 py-1 text-label-caps font-label-caps text-on-surface-variant">
            DEMO CONNECTORS
          </span>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            These connections are simulated for the prototype. Real API integration will replace this demo state.
          </p>
        </div>
        {connectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-label-caps font-label-caps text-on-surface-variant">
              Listening for new orders
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {platforms.map((platform) => {
         const isConnected = platformStates[platform.id]
          const isConnecting = connecting === platform.id

          return (
            <div
              key={platform.id}
              className={`borde shadow rounded bg-surface-container-lowest p-6 flex flex-col gap-4 transition-all ${
                isConnected
                  ? 'border-primary'
                  : 'border-outline-variant hover:border-primary'
              }`}
            >
              {/* Icon + status */}
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 flex items-center justify-center"
                  style={{ backgroundColor: `${platform.color}15` }}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ color: platform.color }}
                  >
                    {platform.icon}
                  </span>
                </div>
                {isConnected && (
                  <span className="w-2 h-2 rounded-full bg-[#10B981] mt-1 shrink-0" />
                )}
              </div>

              {/* Name + desc */}
              <div>
                <p className="text-label-caps font-label-caps text-primary uppercase tracking-widest">
                  {platform.name}
                </p>
                <p className="text-body-sm font-body-sm text-on-surface-variant mt-1 leading-snug">
                  {platform.description}
                </p>
              </div>

              {/* Connect button */}
              <button
                onClick={() => handleToggle(platform.id)}
                disabled={isConnecting}
                className={`mt-auto w-full py-2 text-label-caps font-label-caps tracking-widest transition-all disabled:opacity-50 ${
                  isConnected
                    ? 'borde borde-outline-variant text-on-surface-variant hover:bg-surface-container'
                    : 'bg-primary text-on-primary hover:opacity-90'
                }`}
              >
                {isConnecting ? 'CONNECTING...' : isConnected ? 'DISCONNECT' : 'CONNECT'}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}