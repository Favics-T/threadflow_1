'use client'

import { SourceBadge } from '@/components/ui/SourceBadge'
import { DeadlineBadge } from '@/components/ui/DeadlineBadge'
import { OrderTypeBadge } from './OrderTypeBadge'
import type { BoardOrder } from '@/lib/supabase/orders'
import type { OrderStatus } from '@/types/threadflow'

const STATUS_LABEL: Record<OrderStatus, string> = {
  confirmed: 'Confirmed',
  in_production: 'In Production',
  ready: 'Ready',
  delivered: 'Delivered',
}

export function OrderDetailDrawer({
  order,
  onClose,
  onAssignRequested,
  onConfirmRequested,
  isConfirming,
}: {
  order: BoardOrder
  onClose: () => void
  onAssignRequested: () => void
  onConfirmRequested: () => void
  isConfirming: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative h-full w-full max-w-xl bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-7 border-b border-outline-variant bg-surface-container-low">
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">Order</p>
            <h2 className="font-headline-md text-headline-md text-primary">{order.client_name}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-6 px-8 py-8 grow">
          <div className="flex items-center gap-2 flex-wrap">
            <OrderTypeBadge orderType={order.order_type} />
            <span className="text-label-caps font-label-caps px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant whitespace-nowrap">
              {STATUS_LABEL[order.status]}
            </span>
            <DeadlineBadge deadline={order.deadline} />
          </div>

          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-2">
              Cloth Type
            </p>
            <p className="text-body-lg font-body-lg text-on-surface">{order.cloth_type}</p>
          </div>

          {order.description && (
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-2">
                Description
              </p>
              <p className="text-body-sm font-body-sm text-on-surface leading-relaxed">{order.description}</p>
            </div>
          )}

          <div className="border border-outline-variant">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant bg-surface-container-low">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">forum</span>
              <span className="text-label-caps font-label-caps text-on-surface-variant">Original Client Message</span>
            </div>
            <div className="px-4 py-4">
              {order.message ? (
                <>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <SourceBadge source={order.message.source} />
                    <span className="text-label-caps font-label-caps text-on-surface-variant">
                      {order.message.client_contact}
                    </span>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-surface leading-relaxed italic mb-3">
                    &ldquo;{order.message.content}&rdquo;
                  </p>
                  <a
                    href="/inbox"
                    className="inline-flex items-center gap-1.5 text-label-caps font-label-caps text-primary hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    VIEW IN INBOX
                  </a>
                </>
              ) : (
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  No linked message — this order was created directly from a collection.
                </p>
              )}
            </div>
          </div>

          <div className="border border-outline-variant">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant bg-surface-container-low">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">groups</span>
              <span className="text-label-caps font-label-caps text-on-surface-variant">Assignment Status</span>
            </div>
            <div className="px-4 py-4">
              {order.assignment ? (
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-tertiary mt-0.5">check_circle</span>
                  <div>
                    <p className="text-body-sm font-body-sm font-semibold text-primary">
                      {order.assignment.tailorName}
                    </p>
                    {order.assignment.specialty && (
                      <p className="text-label-caps font-label-caps text-on-surface-variant">
                        {order.assignment.specialty}
                      </p>
                    )}
                    {order.assignment.roleDescription && (
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                        {order.assignment.roleDescription}
                      </p>
                    )}
                    <span
                      className={`inline-block mt-2 text-label-caps font-label-caps px-2 py-0.5 ${
                        order.assignment.approvedByTailor
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {order.assignment.approvedByTailor ? 'APPROVED BY TAILOR' : 'AWAITING TAILOR APPROVAL'}
                    </span>
                  </div>
                </div>
              ) : !order.tailor_confirmed ? (
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <span className="text-label-caps font-label-caps px-2 py-0.5 bg-warning/10 text-warning">
                      NEEDS CONFIRMATION
                    </span>
                    <p className="text-body-sm font-body-sm text-on-surface-variant mt-2">
                      Confirm this order before it can be sent to the assignment engine.
                    </p>
                  </div>
                  <button
                    onClick={onConfirmRequested}
                    disabled={isConfirming}
                    className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm">task_alt</span>
                    {isConfirming ? 'CONFIRMING…' : 'CONFIRM ORDER'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-label-caps font-label-caps px-2 py-0.5 bg-surface-container text-on-surface-variant">
                    UNASSIGNED
                  </span>
                  <button
                    onClick={onAssignRequested}
                    className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    ASSIGN TO TAILOR
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
