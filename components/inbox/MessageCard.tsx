'use client'

import { SourceBadge } from '@/components/ui/SourceBadge'
import { CategoryTag } from './CategoryTag'
import { formatRelativeTime } from '@/lib/format-time'
import type { Message } from '@/types/threadflow'

export function MessageCard({ message, onClick }: { message: Message; onClick: () => void }) {
  const isUnresponded = message.status === 'unresponded'

  return (
    <button
      onClick={onClick}
      className={`w-full text-left border bg-surface-container-lowest border-outline-variant transition-colors hover:bg-surface-container-low ${
        isUnresponded ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
      }`}
    >
      <div className="px-6 py-5">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <SourceBadge source={message.source} />
          <CategoryTag category={message.category} />
          <span className="ml-auto text-label-caps font-label-caps text-on-surface-variant whitespace-nowrap">
            {formatRelativeTime(message.created_at)}
          </span>
        </div>
        <p className="text-body-sm font-body-sm font-semibold text-primary mb-1">
          {message.client_name}
          <span className="font-normal text-on-surface-variant"> · {message.client_contact}</span>
        </p>
        <p className="text-body-sm font-body-sm text-on-surface leading-relaxed line-clamp-2">
          {message.content}
        </p>
      </div>
    </button>
  )
}
