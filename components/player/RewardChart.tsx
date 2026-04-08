import type { DailyReward } from '@/lib/rewards'

interface Props {
  reward: DailyReward
  childName: string
}

export function RewardChart({ reward, childName }: Props) {
  const { accessories, unlockedAccessories, nextAccessory, tasksUntilNext, tasksCompleted, hasCrown } = reward

  // Split: first 5 (chosen) + crown (6th)
  const chosenTiers = accessories.filter(a => !a.isCrown)
  const crown       = accessories.find(a => a.isCrown)

  return (
    <div className="mx-4 mb-2 rounded-2xl bg-warm-50 border border-warm-200 px-4 py-4">
      <div className="flex items-center justify-center gap-2 mb-3">

        {/* Tiers 1–5: parent's chosen emojis */}
        {chosenTiers.map((accessory) => {
          const earned = unlockedAccessories.find(a => a.tasksRequired === accessory.tasksRequired)
          return (
            <div key={accessory.tasksRequired} className="flex flex-col items-center">
              <span className={`text-2xl transition-all duration-500 ${
                earned ? 'opacity-100 scale-110' : 'opacity-20 grayscale'
              }`}>
                {accessory.emoji}
              </span>
            </div>
          )
        })}

        {/* Separator */}
        <div className="w-px h-8 bg-warm-200 mx-1" />

        {/* Crown — always shown, visually special */}
        {crown && (
          <div className="flex flex-col items-center relative">
            <span className={`text-3xl transition-all duration-700 ${
              hasCrown
                ? 'opacity-100 scale-125 animate-bounce-once'
                : 'opacity-20 grayscale'
            }`}
              style={hasCrown ? { filter: 'drop-shadow(0 0 6px gold)' } : {}}
            >
              👑
            </span>
            {hasCrown && (
              <span className="absolute -top-1 -right-1 text-xs animate-pop-in">✨</span>
            )}
          </div>
        )}
      </div>

      {/* Message */}
      <p className="text-center text-sm font-medium text-warm-700">
        {tasksCompleted === 0 && nextAccessory && (
          `Complete a routine to earn your ${nextAccessory.emoji}!`
        )}
        {tasksCompleted > 0 && nextAccessory && !nextAccessory.isCrown && (
          `${tasksUntilNext} more routine${tasksUntilNext === 1 ? '' : 's'} to earn your ${nextAccessory.emoji}!`
        )}
        {tasksCompleted > 0 && nextAccessory?.isCrown && (
          `${tasksUntilNext} more routine${tasksUntilNext === 1 ? '' : 's'} to earn the 👑!`
        )}
        {hasCrown && (
          `${childName} is wearing the crown today! 👑`
        )}
      </p>
    </div>
  )
}
