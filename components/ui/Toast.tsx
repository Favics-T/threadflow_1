'use client'

export function Toast({ message, variant = 'success' }: { message: string; variant?: 'success' | 'error' }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-5 py-3 shadow-lg ${
        variant === 'success'
          ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
          : 'bg-error-container text-on-error-container'
      }`}
    >
      <span className="material-symbols-outlined text-sm">
        {variant === 'success' ? 'check_circle' : 'error'}
      </span>
      <span className="text-body-sm font-body-sm">{message}</span>
    </div>
  )
}
