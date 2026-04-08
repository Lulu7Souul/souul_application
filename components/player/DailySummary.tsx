'use client'

import { AvatarWithAccessories } from '@/components/player/AvatarWithAccessories'
import type { DailyReward } from '@/lib/rewards'

interface Props {
  childName: string
  avatarEmoji: string
  reward: DailyReward
  onClose: () => void
}

// Shown when child exits Lulu for the day — a warm summary of what they achieved.
// Celebrates effort, not perfection. Every task count is positive.
export function DailySummary({ childName, avatarEmoji, reward, onClose }: Props) {
  const { tasksCompleted, unlockedAccessories } = reward

  function getMessage() {
    if (tasksCompleted === 0) return 'See you next time!'
    if (tasksCompleted === 1) return 'You did one routine today. Well done!'
    if (tasksCompleted <= 3) return `You did ${tasksCompleted} routines today. Great work!`
    if (tasksCompleted <= 4) return `${tasksCompleted} routines! You had a brilliant day!`
    return `${tasksCompleted} routines — what an amazing day!`
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center">
      {/* Avatar with all today's accessories */}
      <AvatarWithAccessories
        avatarEmoji={avatarEmoji}
        accessories={unlockedAccessories}
        size="lg"
      />

      {/* Summary message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text-primary">
          See you soon, {childName}!
        </h2>
        <p className="text-text-secondary text-lg">{getMessage()}</p>
      </div>

      {/* Accessories earned today */}
      {unlockedAccessories.length > 0 && (
        <div className="rounded-2xl bg-warm-50 border border-warm-200 px-6 py-4 w-full max-w-xs space-y-3">
          <p className="text-sm font-semibold text-warm-700 text-center">
            Today's rewards
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {unlockedAccessories.map(a => (
              <div key={a.id} className="flex flex-col items-center gap-1">
                <span className="text-3xl">{a.emoji}</span>
                <span className="text-xs text-text-muted">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="rounded-player bg-brand-500 text-white px-10 py-5 text-xl font-bold active:scale-95 transition-transform"
      >
        Bye for now!
      </button>
    </div>
  )
}
