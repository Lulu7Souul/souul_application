'use client'

import { useEffect } from 'react'
import { playSound } from '@/lib/sounds'

interface Props {
  childName: string
  rewardText?: string
  rewardImageUrl?: string
  onContinue: () => void
}

export function CelebrationScreen({ childName, rewardText, rewardImageUrl, onContinue }: Props) {
  useEffect(() => {
    // Play celebration sound on mount
    playSound('/sounds/celebration/well-done.mp3', 0.8)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center">
      {/* Celebration animation — CSS only, no heavy libraries */}
      <div className="text-8xl animate-bounce">⭐</div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-brand-600">Well done, {childName}!</h2>
        {rewardText && (
          <p className="text-xl text-text-secondary">{rewardText}</p>
        )}
      </div>

      {rewardImageUrl && (
        <div className="w-48 h-48 rounded-3xl overflow-hidden bg-surface-subtle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={rewardImageUrl} alt="Reward" className="w-full h-full object-contain" />
        </div>
      )}

      <button
        onClick={onContinue}
        className="rounded-player bg-brand-500 text-white px-10 py-5 text-xl font-bold active:scale-95 transition-transform"
        aria-label="Continue to today's routines"
      >
        Back to today
      </button>
    </div>
  )
}
