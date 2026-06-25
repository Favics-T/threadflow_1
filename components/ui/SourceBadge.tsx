import type { MessageSource } from '@/types/threadflow'

const SOURCE_CONFIG: Record<MessageSource, { label: string; icon: string; className: string }> = {
  instagram: {
    label: 'Instagram',
    icon: 'photo_camera',
    className: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white',
  },
  whatsapp: {
    label: 'WhatsApp',
    icon: 'chat',
    className: 'bg-green-500 text-white',
  },
  facebook: {
    label: 'Facebook',
    icon: 'thumb_up',
    className: 'bg-blue-600 text-white',
  },
  website: {
    label: 'Website',
    icon: 'language',
    className: 'bg-gray-500 text-white',
  },
}

export function SourceBadge({ source }: { source: MessageSource }) {
  const cfg = SOURCE_CONFIG[source]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-label-caps font-label-caps shrink-0 ${cfg.className}`}>
      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
        {cfg.icon}
      </span>
      {cfg.label}
    </span>
  )
}
