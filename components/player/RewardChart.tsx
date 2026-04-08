import type { DailyReward } from '@/lib/rewards'

interface Props {
  reward: DailyReward
  childName: string
}

export function RewardChart({ reward, childName }: Props) {
  const { accessories, unlockedAccessories, nextAccessory, tasksUntilNext, tasksCompleted } = reward

  return (
    <div className="mx-4 mb-2 rounded-2xl bg-warm-50 border border-warm-200 px-4 py-4">
      {/* The 5 chosen emojis — greyed until earned */}
      <div className="flex items-center justify-center gap-3 mb-3">
        {accessories.map((accessory, i) => {
          const earned = unlockedAccessories.find(a => a.emoji === accessory.emoji && a.tasksRequired === accessory.tasksRequired)
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className={`text-2xl transition-all duration-500 ${
                earned ? 'opacity-100 scale-110' : 'opacity-20 grayscale'
              }`}>
                {accessory.emoji}
              </span>
            </div>
          )
        })}
      </div>

      {/* Message */}
      <p className="text-center text-sm font-medium text-warm-700">
        {tasksCompleted === 0 && nextAccessory && (
          `Complete a routine to earn your ${nextAccessory.emoji}!`
        )}
        {tasksCompleted > 0 && nextAccessory && (
          `${tasksUntilNext} more routine${tasksUntilNext === 1 ? '' : 's'} to earn your ${nextAccessory.emoji}!`
        )}
        {tasksCompleted > 0 && !nextAccessory && (
          `${childName} earned everything today! 🎉`
        )}
      </p>
    </div>
  )
}
