'use client'

import { useState } from 'react'
import type { PendingReply } from '@/lib/types/dashboard'

const pendingReply: PendingReply = {
  clientName: 'Adaeze Okonkwo',
  message:
    'Hello Adaeze, great news! Your order is on track and we are expecting to have it ready for you by Jun 28. We will reach out as soon as it is ready for pickup or delivery. Thank you for choosing us!',
}

export function ApprovalGate() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'discarded'>('pending')

  if (status === 'approved') {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-emerald-600">
          <i className="ti ti-circle-check text-lg" aria-hidden="true" />
          <span className="text-sm font-medium">Reply sent to {pendingReply.clientName}</span>
        </div>
      </div>
    )
  }

  if (status === 'discarded') {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <p className="text-sm text-gray-400">Reply discarded. No message was sent.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <p className="text-[11px] text-gray-400 mb-3 uppercase tracking-wide">Pending approval</p>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <i className="ti ti-robot text-sm text-emerald-600" aria-hidden="true" />
          <span className="text-xs font-medium text-emerald-700">
            Draft for {pendingReply.clientName}
          </span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          "{pendingReply.message}"
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setStatus('approved')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Approve & Send
          </button>
          <button
            onClick={() => setStatus('discarded')}
            className="text-gray-500 border border-gray-200 text-xs px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}