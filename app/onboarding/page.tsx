'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scissors, ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react'

type Answers = {
  businessType: string
  teamSize: string
  orderSources: string[]
  goals: string[]
  studioName: string
}

const INITIAL_ANSWERS: Answers = {
  businessType: '',
  teamSize: '',
  orderSources: [],
  goals: [],
  studioName: '',
}

const PILL_STEPS = [
  {
    question: 'What type of fashion business do you run?',
    subtitle: 'This helps us set up your studio correctly',
    options: [
      'Custom tailoring studio',
      'Fashion house',
      'Bridal studio',
      'Ready-to-wear brand',
      'Alterations & repairs',
      'Other',
    ],
    multiSelect: false,
  },
  {
    question: 'How big is your team?',
    subtitle: "We'll configure tailor workload limits accordingly",
    options: ['Just me', '2–5 tailors', '6–10 tailors', '11–20 tailors', '20+ tailors'],
    multiSelect: false,
  },
  {
    question: 'Where do most of your orders come from?',
    subtitle: 'Connect the right platforms to your inbox',
    options: ['Instagram DMs', 'WhatsApp', 'Facebook', 'Walk-ins', 'Website booking form', 'Referrals', 'Other'],
    multiSelect: true,
  },
  {
    question: 'What do you want ThreadFlow to help you with first?',
    subtitle: 'You can always add more later',
    options: [
      'Track client orders',
      'Reply to messages with AI',
      'Assign tailors automatically',
      'Monitor fabric stock',
      'Generate delivery estimates',
      'Morning studio brief',
      'Manage workforce performance',
    ],
    multiSelect: true,
  },
] as const

const PREVIEW_CARDS = [
  { initials: 'AO', name: 'Amaka Obi', status: 'In Production', badgeClass: 'bg-amber-100 text-amber-700', progress: 55, muted: true },
  { initials: 'CN', name: 'Chidi Nwosu', status: 'AI Assigned', badgeClass: 'bg-blue-100 text-blue-700', progress: 25, muted: true },
  { initials: 'FA', name: 'Folake Adeyemi', status: 'Completed', badgeClass: 'bg-emerald-100 text-emerald-700', progress: 100, muted: false },
  { initials: 'TB', name: 'Tunde Bakare', status: 'Ready for Delivery', badgeClass: 'bg-emerald-100 text-emerald-700', progress: 90, muted: true },
  { initials: 'NC', name: 'Ngozi Chukwu', status: 'In Production', badgeClass: 'bg-amber-100 text-amber-700', progress: 40, muted: true },
]

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
        <Scissors className="h-4 w-4 text-white" />
      </div>
      <span className="text-lg font-bold text-gray-900">ThreadFlow</span>
    </div>
  )
}

function StepProgress({ step }: { step: number }) {
  return (
    <div className="mt-5 flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`h-1.5 rounded-full transition-all ${
            n === step ? 'w-6 bg-blue-600' : n < step ? 'w-1.5 bg-blue-600' : 'w-1.5 bg-gray-200'
          }`}
        />
      ))}
      <span className="ml-1.5 text-xs font-medium text-gray-400">Step {step} of 5</span>
    </div>
  )
}

function PillGroup({
  options,
  isSelected,
  onToggle,
}: {
  options: readonly string[]
  isSelected: (option: string) => boolean
  onToggle: (option: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const selected = isSelected(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              selected
                ? 'border-2 border-blue-600 bg-white text-blue-600'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS)
  const [isLoading, setIsLoading] = useState(false)

  function toggleMulti(key: 'orderSources' | 'goals', option: string) {
    setAnswers((prev) => {
      const current = prev[key]
      const next = current.includes(option) ? current.filter((v) => v !== option) : [...current, option]
      return { ...prev, [key]: next }
    })
  }

  function getSelection(stepNumber: number) {
    switch (stepNumber) {
      case 1:
        return {
          isSelected: (o: string) => answers.businessType === o,
          onToggle: (o: string) => setAnswers((prev) => ({ ...prev, businessType: o })),
        }
      case 2:
        return {
          isSelected: (o: string) => answers.teamSize === o,
          onToggle: (o: string) => setAnswers((prev) => ({ ...prev, teamSize: o })),
        }
      case 3:
        return {
          isSelected: (o: string) => answers.orderSources.includes(o),
          onToggle: (o: string) => toggleMulti('orderSources', o),
        }
      default:
        return {
          isSelected: (o: string) => answers.goals.includes(o),
          onToggle: (o: string) => toggleMulti('goals', o),
        }
    }
  }

  function canContinue(): boolean {
    if (step === 1) return answers.businessType !== ''
    if (step === 2) return answers.teamSize !== ''
    if (step === 3) return answers.orderSources.length > 0
    if (step === 4) return answers.goals.length > 0
    return answers.studioName.trim() !== ''
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1))
  }

  function handleContinue() {
    if (!canContinue()) return

    if (step < 5) {
      setStep((s) => Math.min(s + 1, 5))
      return
    }

    setIsLoading(true)
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  const navButtons = (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleBack}
        disabled={step === 1}
        className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>
      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue() || isLoading}
        className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
          canContinue() && !isLoading
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'cursor-not-allowed bg-gray-200 text-gray-400'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading
          </>
        ) : (
          <>
            Continue
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  )

  if (step === 5) {
    return (
      <div className="fixed inset-0 z-60 flex bg-white">
        <div className="flex w-full flex-col lg:w-1/2">
          <div className="flex-1 overflow-y-auto px-8 py-10 sm:px-16 lg:px-20">
            <Logo />
            <StepProgress step={step} />

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleContinue()
              }}
              className="mt-12 max-w-sm"
            >
              <h1 className="text-3xl font-bold text-gray-900">You&apos;re all set — let&apos;s set up your studio</h1>
              <p className="mt-2 text-base text-gray-500">Tell us your studio name to get started</p>

              <label htmlFor="studioName" className="mt-8 block text-sm font-medium text-gray-700">
                Studio name
              </label>
              <input
                id="studioName"
                type="text"
                autoFocus
                value={answers.studioName}
                onChange={(e) => setAnswers((prev) => ({ ...prev, studioName: e.target.value }))}
                placeholder="e.g. Adaeze Couture"
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600"
              />
            </form>
          </div>

          <div className="border-t border-gray-100 px-8 py-6 sm:px-16 lg:px-20">
            <div className="max-w-sm">{navButtons}</div>
          </div>
        </div>

        <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-linear-to-br from-indigo-950 via-purple-900 to-purple-700 lg:flex">
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative w-full max-w-sm space-y-3 px-6">
            {PREVIEW_CARDS.map((card, i) => (
              <div
                key={card.name}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  card.muted ? 'bg-white/50' : 'bg-white shadow-xl'
                } ${i % 2 === 1 ? 'ml-6' : 'mr-6'}`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                  {card.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{card.name}</p>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100">
                    <div
                      className="h-1.5 rounded-full bg-blue-500"
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                </div>
                {!card.muted && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${card.badgeClass}`}>
                  {card.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const config = PILL_STEPS[step - 1]
  const { isSelected, onToggle } = getSelection(step)

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto px-8 py-10 sm:px-16">
        <Logo />
        <StepProgress step={step} />

        <div className="mx-auto mt-12 w-full max-w-lg">
          <h1 className="text-3xl font-bold text-gray-900">{config.question}</h1>
          <p className="mt-2 text-base text-gray-500">{config.subtitle}</p>

          <div className="mt-8">
            <PillGroup options={config.options} isSelected={isSelected} onToggle={onToggle} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 px-8 py-6 sm:px-16">
        <div className="mx-auto w-full max-w-lg">{navButtons}</div>
      </div>
    </div>
  )
}
