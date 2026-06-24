import type { ConversationPlatform } from '@/lib/types/conversations'

type PlatformConfig = {
  label: string
  icon: string
  color: string
  bg: string
}

const PLATFORM_CONFIG: Record<ConversationPlatform, PlatformConfig> = {
  instagram: { label: 'Instagram', icon: 'photo_camera', color: '#E1306C', bg: '#E1306C15' },
  whatsapp:  { label: 'WhatsApp',  icon: 'chat',         color: '#25D366', bg: '#25D36615' },
  website:   { label: 'Website',   icon: 'language',     color: '#4F46E5', bg: '#4F46E515' },
  facebook:  { label: 'Facebook',  icon: 'thumb_up',     color: '#1877F2', bg: '#1877F215' },
}

interface PlatformBadgeProps {
  platform: ConversationPlatform
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const cfg = PLATFORM_CONFIG[platform]

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-0.5"
      style={{ backgroundColor: cfg.bg }}
    >
      <span
        className="material-symbols-outlined"
        style={{ color: cfg.color, fontSize: '14px' }}
      >
        {cfg.icon}
      </span>
      <span
        className="text-label-caps font-label-caps"
        style={{ color: cfg.color }}
      >
        {cfg.label}
      </span>
    </div>
  )
}
