interface PipelineSectionProps {
  /** Section label rendered in ALL CAPS tracking-widest style */
  label: string
  /** Count shown in pill next to the label */
  count: number
  /** Short descriptive sub-text beneath the label */
  description: string
  children: React.ReactNode
}

/**
 * Shared wrapper for each pipeline stage.
 * Renders the section heading, counter pill, description text, and children slot.
 * Matches the visual language of existing `<section>` blocks throughout the app.
 */
export function PipelineSection({ label, count, description, children }: PipelineSectionProps) {
  return (
    <section className="mb-12">
      {/* Section header */}
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            {label}
          </h2>
          <span className="bg-surface-container text-on-surface-variant text-label-caps font-label-caps px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        <p className="text-body-sm font-body-sm text-on-surface-variant">{description}</p>
      </div>

      {/* Stage cards */}
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}
