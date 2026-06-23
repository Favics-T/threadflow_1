"use client";

import { useState } from "react";

export function ApprovalGate() {
  const [status, setStatus] = useState<"pending" | "approved" | "discarded">("pending");

  if (status === "approved") {
    return (
      <div className="border border-outline-variant bg-surface-container-lowest p-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">check_circle</span>
          <p className="text-body-sm font-body-sm text-on-surface">
            Reply sent to Adaeze Okonkwo.
          </p>
        </div>
      </div>
    );
  }

  if (status === "discarded") {
    return (
      <div className="border border-outline-variant bg-surface-container-lowest p-6">
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          Reply discarded. No message was sent.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-outline-variant bg-surface-container-lowest">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
        <div>
          <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">
            Pending Approval
          </p>
          <h2 className="font-headline-md text-headline-md text-primary">
            Draft Reply
          </h2>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">mark_chat_unread</span>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {/* Agent source label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-sm text-tertiary">magic_button</span>
          <span className="text-label-caps font-label-caps text-on-surface-variant">
            AI drafted · for Adaeze Okonkwo
          </span>
        </div>

        {/* Draft message */}
        <div className="bg-surface-container-low border border-outline-variant p-4 mb-6">
          <p className="text-body-sm font-body-sm text-on-surface leading-relaxed italic">
            "Hello Adaeze, great news! Your order is on track and we are expecting
            to have it ready for you by Jun 28. We will reach out as soon as it is
            ready for pickup or delivery. Thank you for choosing us!"
          </p>
        </div>

        {/* Actions — matching exact button pattern from existing code */}
        <div className="flex gap-3">
          <button
            onClick={() => setStatus("approved")}
            className="flex-1 py-3 bg-primary text-on-primary text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
          >
            APPROVE & SEND
          </button>
          <button
            onClick={() => setStatus("discarded")}
            className="flex-1 py-3 border border-outline-variant text-on-surface-variant text-label-caps font-label-caps hover:bg-surface-container transition-colors"
          >
            DISCARD
          </button>
        </div>
      </div>
    </div>
  );
}