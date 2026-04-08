'use client'

import { useEffect } from 'react'
import { playSound } from '@/lib/sounds'
import { AvatarWithAccessories } from '@/components/player/AvatarWithAccessories'
import type { Accessory } from '@/lib/rewards'
import type { DailyReward } from '@/lib/rewards'

interface Props {
  childName: string
  avatarEmoji: string
  rewardText?: string
  rewardImageUrl?: string
  dailyReward: DailyReward
  newlyEarned: Accessory | null
  onContinue: () => void
}

export function CelebrationScreen({
  childName,
  avatarEmoji,
  rewardText,
  rewardImageUrl,
  dailyReward,
  newlyEarned,
  onContinue,
}: Props) {
  useEffect(() => {
    playSound('/sounds/celebration/well-done.mp3', 0.8)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center">
      {/* Avatar with all accessories earned so far today */}
      <div className="animate-bounce-once">
        <AvatarWithAccessories
          avatarEmoji={avatarEmoji}
          accessories={dailyReward.unlockedAccessories}
          size="lg"
        />
      </div>

      {/* Well done message */}
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-brand-600">Well done, {childName}!</h2>
        {rewardText && (
          <p className="text-xl text-text-secondary">{rewardText}</p>
        )}
      </div>

      {/* Newly earned accessory callout */}
      {newlyEarned && (
        <div className="rounded-2xl bg-warm-50 border-2 border-warm-200 px-6 py-4 space-y-1 animate-pop-in">
          <p className="text-4xl">{newlyEarned.emoji}</p>
          <p className="text-base font-semibold text-warm-700">
            {newlyEarned.description}
          </p>
        </div>
      )}

      {/* Reward image if set */}
      {rewardImageUrl && (
        <div className="w-36 h-36 rounded-3xl overflow-hidden bg-surface-subtle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={rewardImageUrl} alt="Reward" className="w-full h-full object-contain" />
        </div>
      )}

      {/* Next accessory nudge */}
      {dailyReward.nextAccessory && (
        <p className="text-sm text-text-muted">
          {dailyReward.tasksUntilNext} more routine{dailyReward.tasksUntilNext === 1 ? '' : 's'} to earn{' '}
          {dailyReward.nextAccessory.emoji}
        </p>
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
