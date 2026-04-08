// Lulu Reward System
// Accessories are earned through completing routines — warm, not competitive.
// Design principle: a cosy gift, not a leaderboard.

export interface Accessory {
  id: string
  emoji: string
  label: string
  position: 'top' | 'top-right' | 'bottom-right' | 'surround'
  tasksRequired: number
  description: string  // shown to child in celebration/summary
}

// Accessories unlock progressively through the day.
// Max displayed: all that have been unlocked stack on the avatar.
export const ACCESSORIES: Accessory[] = [
  {
    id: 'star',
    emoji: '⭐',
    label: 'Star',
    position: 'top-right',
    tasksRequired: 1,
    description: 'You earned a star!',
  },
  {
    id: 'bow',
    emoji: '🎀',
    label: 'Ribbon',
    position: 'top',
    tasksRequired: 2,
    description: 'A ribbon for working so hard!',
  },
  {
    id: 'sparkles',
    emoji: '✨',
    label: 'Sparkles',
    position: 'surround',
    tasksRequired: 3,
    description: 'Sparkles — you are shining today!',
  },
  {
    id: 'rainbow',
    emoji: '🌈',
    label: 'Rainbow',
    position: 'top',
    tasksRequired: 4,
    description: 'A rainbow day!',
  },
  {
    id: 'crown',
    emoji: '👑',
    label: 'Crown',
    position: 'top',
    tasksRequired: 5,
    description: 'A crown — you had an amazing day!',
  },
]

export interface DailyReward {
  tasksCompleted: number
  unlockedAccessories: Accessory[]
  nextAccessory: Accessory | null
  tasksUntilNext: number
}

export function calculateDailyReward(tasksCompleted: number): DailyReward {
  const unlocked = ACCESSORIES.filter(a => tasksCompleted >= a.tasksRequired)
  const locked   = ACCESSORIES.filter(a => tasksCompleted < a.tasksRequired)
  const next     = locked[0] ?? null

  return {
    tasksCompleted,
    unlockedAccessories: unlocked,
    nextAccessory: next,
    tasksUntilNext: next ? next.tasksRequired - tasksCompleted : 0,
  }
}

// Returns the single most recently earned accessory (for post-task celebration)
export function justEarnedAccessory(
  previousCount: number,
  newCount: number
): Accessory | null {
  const wasBefore = ACCESSORIES.filter(a => previousCount >= a.tasksRequired)
  const isNow     = ACCESSORIES.filter(a => newCount >= a.tasksRequired)
  const newlyEarned = isNow.filter(a => !wasBefore.find(b => b.id === a.id))
  return newlyEarned[newlyEarned.length - 1] ?? null
}
