'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Step } from '@/lib/types/sequence'

const COUNTDOWN_SECONDS = 5

interface Props {
  nextStep: Step
  stepNumber: number
  totalSteps: number
  onReady: () => void
}

// Brief "get ready" screen shown between steps when transition_notice is on.
// Child sees what's coming next, taps "I'm ready!" or waits 5 seconds.
export function TransitionNotice({ nextStep, stepNumber, totalSteps, onReady }: Props) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)

  useEffect(() => {
    if (countdown <= 0) {
      onReady()
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, onReady])

  const progressPct = (countdown / COUNTDOWN_SECONDS) * 100

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center bg-brand-50">
      {/* Label */}
      <p className="text-sm font-semibold text-brand-400 uppercase tracking-widest">
        Coming up next
      </p>

      {/* Step visual */}
      <div className="w-56 h-56 rounded-3xl overflow-hidden bg-surface-raised flex items-center justify-center shadow-sm">
        {nextStep.visual_url ? (
          <Image
            src={nextStep.visual_url}
            alt={nextStep.title || `Step ${stepNumber}`}
            width={224}
            height={224}
            className="object-contain"
          />
        ) : (
          <span className="text-8xl">✨</span>
        )}
      </div>

      {/* Step info */}
      <div className="space-y-1">
        <p className="text-xs text-text-muted">
          Step {stepNumber} of {totalSteps}
        </p>
        {nextStep.title && (
          <p className="text-2xl font-bold text-text-primary leading-snug max-w-xs">
            {nextStep.title}
          </p>
        )}
      </div>

      {/* Ready button + countdown bar */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <button
          onClick={onReady}
          className="w-full rounded-player bg-brand-500 text-white py-5 text-xl font-bold active:scale-95 transition-transform"
        >
          I'm ready!
        </button>

        {/* Countdown bar — drains left to right over 5s */}
        <div className="w-full h-1.5 bg-brand-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-300 rounded-full transition-all duration-1000"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-text-muted">Starting in {countdown}…</p>
      </div>
    </div>
  )
}
