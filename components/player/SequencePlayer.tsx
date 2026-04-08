'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ActionBar } from '@/components/player/ActionBar'
import { TransitionNotice } from '@/components/player/TransitionNotice'
import { playStepVoice } from '@/lib/voice'
import { playSound, SOUNDS_BY_CUE_TYPE } from '@/lib/sounds'
import type { Sequence, Step } from '@/lib/types/sequence'
import type { VoiceSettings } from '@/lib/types/voice'

interface Props {
  sequence: Sequence
  voiceSettings: VoiceSettings
  transitionEnabled: boolean
  onComplete: (log: SessionLogData) => void
  onBreak: () => void
}

export interface SessionLogData {
  stepsSkipped: number[]
  helpTappedCount: number
  breakTappedCount: number
  timeExtensionsCount: number
}

export function SequencePlayer({ sequence, voiceSettings, transitionEnabled, onComplete, onBreak }: Props) {
  const steps = sequence.steps ?? []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [log, setLog] = useState<SessionLogData>({
    stepsSkipped: [],
    helpTappedCount: 0,
    breakTappedCount: 0,
    timeExtensionsCount: 0,
  })

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentStep: Step | undefined = steps[currentIndex]
  const nextStep: Step | undefined = steps[currentIndex + 1]

  // On step change: play voice then music cue.
  // This only fires when currentIndex changes — i.e. AFTER the transition, not during.
  useEffect(() => {
    if (!currentStep) return
    setShowHelp(false)

    // 300ms pause before voice — gives child time to see the visual
    const timeout = setTimeout(async () => {
      await playStepVoice(
        voiceSettings,
        currentStep.help_text,
        currentStep.audio_url,
      )

      // Music cue plays after voice
      if (currentStep.cue_type && SOUNDS_BY_CUE_TYPE[currentStep.cue_type]?.[0]) {
        await playSound(SOUNDS_BY_CUE_TYPE[currentStep.cue_type][0].path)
      }

      // Start timer if set
      if (currentStep.duration_seconds) {
        setTimeLeft(currentStep.duration_seconds)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) {
      setTimeLeft(null)
      return
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => (t !== null ? t - 1 : null))
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timeLeft])

  function handleDone() {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(null)
    window.speechSynthesis?.cancel()

    if (currentIndex >= steps.length - 1) {
      // Last step — complete the sequence
      onComplete(log)
      return
    }

    if (transitionEnabled) {
      setIsTransitioning(true)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  const handleTransitionReady = useCallback(() => {
    setIsTransitioning(false)
    setCurrentIndex(i => i + 1)
  }, [])

  function handleHelp() {
    setLog(l => ({ ...l, helpTappedCount: l.helpTappedCount + 1 }))
    setShowHelp(true)
  }

  function handleMoreTime() {
    setLog(l => ({ ...l, timeExtensionsCount: l.timeExtensionsCount + 1 }))
    if (currentStep?.duration_seconds) {
      setTimeLeft(currentStep.duration_seconds)
    }
  }

  function handleBreak() {
    setLog(l => ({ ...l, breakTappedCount: l.breakTappedCount + 1 }))
    onBreak()
  }

  if (!currentStep) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-muted">No steps in this routine.</p>
      </div>
    )
  }

  // Transition screen — shown between steps when transitionEnabled
  if (isTransitioning && nextStep) {
    return (
      <TransitionNotice
        nextStep={nextStep}
        stepNumber={currentIndex + 2}
        totalSteps={steps.length}
        onReady={handleTransitionReady}
      />
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Step progress — subtle, top */}
      <div className="flex gap-1.5 px-4 pt-4 pb-2 justify-center" aria-label={`Step ${currentIndex + 1} of ${steps.length}`}>
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < currentIndex ? 'bg-brand-400' :
              i === currentIndex ? 'bg-brand-500' :
              'bg-border'
            }`}
          />
        ))}
      </div>

      {/* Timer bar */}
      {timeLeft !== null && currentStep.duration_seconds && (
        <div className="px-4">
          <div className="h-2 bg-surface-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-calm-400 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / currentStep.duration_seconds) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main step content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 min-h-0">
        {showHelp ? (
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <p className="text-4xl">💛</p>
            <p className="text-2xl font-semibold text-text-primary leading-relaxed max-w-xs">
              {currentStep.help_text || 'Ask a grown-up to help you.'}
            </p>
            <button
              onClick={() => setShowHelp(false)}
              className="rounded-player bg-surface-subtle border-2 border-border px-8 py-4 font-semibold text-text-primary text-lg"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            {currentStep.visual_url ? (
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-surface-subtle">
                <Image
                  src={currentStep.visual_url}
                  alt={currentStep.title || `Step ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="w-full aspect-square rounded-3xl bg-brand-50 flex items-center justify-center">
                <span className="text-8xl">⭐</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action bar — always at bottom */}
      {!showHelp && (
        <ActionBar
          onDone={handleDone}
          onHelp={handleHelp}
          onMoreTime={handleMoreTime}
          onBreak={handleBreak}
        />
      )}
    </div>
  )
}
