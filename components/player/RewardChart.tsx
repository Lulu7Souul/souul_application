import type { DailyReward } from '@/lib/rewards'
import { ACCESSORIES } from '@/lib/rewards'

interface Props {
  reward: DailyReward
  childName: string
}

// Shown at the top of /play/today — child's daily progress at a glance.
// Warm, visual, low-pressure. No numbers or percentages shown to child.
export function RewardChart({ reward, childName }: Props) {
  const { tasksCompleted, unlockedAccessories, nextAccessory, tasksUntilNext } = reward

  if (tasksCompleted === 0 && !nextAccessory) return null

  return (
    <div className="mx-4 mb-2 rounded-2xl bg-warm-50 border border-warm-200 px-4 py-4">
      {/* Accessory dots — one per tier, filled or empty */}
      <div className="flex items-center justify-center gap-3 mb-3">
        {ACCESSORIES.map(accessory => {
          const earned = unlockedAccessories.find(a => a.id === accessory.id)
          return (
            <div
              key={accessory.id}
              className="flex flex-col items-center gap-1"
              title={accessory.label}
            >
              <span className={`text-2xl transition-all duration-500 ${
                earned ? 'opacity-100 scale-110' : 'opacity-20 grayscale'
              }`}>
                {accessory.emoji}
              </span>
            </div>
          )
        })}
      </div>

      {/* Encouraging message */}
      <p className="text-center text-sm font-medium text-warm-700">
        {tasksCompleted === 0 && (
          `Complete a routine to earn your first ${nextAccessory?.emoji ?? '⭐'}!`
        )}
        {tasksCompleted > 0 && nextAccessory && (
          `${tasksUntilNext} more routine${tasksUntilNext === 1 ? '' : 's'} to earn your ${nextAccessory.emoji}!`
        )}
        {tasksCompleted > 0 && !nextAccessory && (
          `${childName} earned everything today! 👑`
        )}
      </p>
    </div>
  )
}
