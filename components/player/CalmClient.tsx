'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { playSound } from '@/lib/sounds'

// Built-in calm corner — shown when child taps Break and no custom calm
// sequence is assigned to their profile.
// Simple breathing guide: in for 4, out for 6. Three rounds.

type Phase = 'intro' | 'breathe-in' | 'breathe-out' | 'done'

export function CalmClient({ returnTo }: { returnTo: string }) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [round, setRound] = useState(1)
  const [secondsLeft, setSecondsLeft] = useState(4)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const TOTAL_ROUNDS = 3

  function clearTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  function startBreathing() {
    setPhase('breathe-in')
    setSecondsLeft(4)
    playSound('/sounds/calm/breathe-in.mp3', 0.7)
  }

  useEffect(() => {
    if (phase === 'intro' || phase === 'done') return

    clearTimer()
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearTimer()
          // Transition to next phase
          if (phase === 'breathe-in') {
            setPhase('breathe-out')
            setSecondsLeft(6)
            playSound('/sounds/calm/breathe-out.mp3', 0.7)
          } else {
            // breathe-out done
            if (round < TOTAL_ROUNDS) {
              setRound(r => r + 1)
              setPhase('breathe-in')
              setSecondsLeft(4)
              playSound('/sounds/calm/breathe-in.mp3', 0.7)
            } else {
              setPhase('done')
            }
          }
          return 0
        }
        return s - 1
      })
    }, 1000)

    return clearTimer
  }, [phase, round]) // eslint-disable-line react-hooks/exhaustive-deps

  // Circle animation: grows on breathe-in, shrinks on breathe-out
  const circleSize = phase === 'breathe-in'
    ? 'scale-100 bg-calm-200'
    : phase === 'breathe-out'
    ? 'scale-75 bg-calm-100'
    : 'scale-75 bg-calm-100'

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center">

      {phase === 'intro' && (
        <>
          <span className="text-7xl">🌿</span>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-text-primary">Let's take a breath</h2>
            <p className="text-text-secondary">Lulu will guide you. Ready?</p>
          </div>
          <button
            onClick={startBreathing}
            className="rounded-player bg-calm-400 text-white px-10 py-5 text-xl font-bold active:scale-95 transition-transform"
          >
            I'm ready
          </button>
        </>
      )}

      {(phase === 'breathe-in' || phase === 'breathe-out') && (
        <>
          {/* Breathing circle */}
          <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-[3500ms] ease-in-out ${circleSize}`}>
            <span className="text-5xl">🌿</span>
          </div>

          <div className="space-y-2">
            <p className="text-3xl font-bold text-calm-600">
              {phase === 'breathe-in' ? 'Breathe in…' : 'Breathe out…'}
            </p>
            <p className="text-5xl font-bold text-text-primary tabular-nums">{secondsLeft}</p>
            <p className="text-sm text-text-muted">Breath {round} of {TOTAL_ROUNDS}</p>
          </div>
        </>
      )}

      {phase === 'done' && (
        <>
          <span className="text-7xl">💛</span>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-text-primary">Well done.</h2>
            <p className="text-text-secondary">Take your time. When you're ready…</p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => router.replace(returnTo)}
              className="rounded-player bg-brand-500 text-white px-8 py-5 text-xl font-bold active:scale-95 transition-transform"
            >
              Back to my routine
            </button>
            <button
              onClick={startBreathing}
              className="rounded-player bg-calm-100 text-calm-700 px-8 py-4 text-base font-semibold active:scale-95 transition-transform border-2 border-calm-200"
            >
              One more breath
            </button>
          </div>
        </>
      )}
    </div>
  )
}
