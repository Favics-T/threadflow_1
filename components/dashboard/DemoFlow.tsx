'use client'

export function DemoFlow() {
  return (
    <section className="border border-outline-variant bg-surface-container-lowest p-6 mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Demo Flow
          </p>
          <h2 className="font-headline-md text-headline-md text-primary mt-0.5">
            Hackathon Demo Path
          </h2>
        </div>
        <span className="text-label-caps font-label-caps rounded-full bg-surface-container px-3 py-1 text-on-surface-variant">
          Recommended script
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            title: 'Morning Brief',
            description: 'Generate the studio summary to surface fabric alerts, blocked orders, and capacity risks.',
          },
          {
            title: 'Delivery Estimate',
            description: 'Ask the AI when a specific order will be ready and show the tool reasoning chain.',
          },
          {
            title: 'Draft Client Reply',
            description: 'Have the AI draft a status update and approve it before sending.',
          },
          {
            title: 'Review Orders',
            description: 'Inspect active orders, tailor workload, and fabric stock in one place.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-outline-variant bg-surface-container p-5">
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-2">
              {item.title}
            </p>
            <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
