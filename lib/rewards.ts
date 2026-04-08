// Lulu Reward System
// Accessories are the 5 emojis chosen by the parent at profile setup.
// They unlock one per completed routine through the day.
// Design principle: a cosy gift, not a leaderboard.

import { getEmojiQuote, DEFAULT_ACCESSORIES } from '@/lib/emoji-library'

export interface Accessory {
  emoji: string
  quote: string       // What Lulu says when this is earned
  tasksRequired: number
}

// Build the 5 accessory tiers from the parent's chosen emojis
export function buildAccessories(chosenEmojis: string[]): Accessory[] {
  const emojis = chosenEmojis.length === 5 ? chosenEmojis : DEFAULT_ACCESSORIES
  return emojis.map((emoji, i) => ({
    emoji,
    quote: getEmojiQuote(emoji),
    tasksRequired: i + 1,
  }))
}

export interface DailyReward {
  tasksCompleted: number
  accessories: Accessory[]          // all 5 tiers
  unlockedAccessories: Accessory[]  // earned so far today
  nextAccessory: Accessory | null
  tasksUntilNext: number
}

export function calculateDailyReward(
  tasksCompleted: number,
  chosenEmojis: string[] = DEFAULT_ACCESSORIES
): DailyReward {
  const accessories = buildAccessories(chosenEmojis)
  const unlocked    = accessories.filter(a => tasksCompleted >= a.tasksRequired)
  const locked      = accessories.filter(a => tasksCompleted < a.tasksRequired)
  const next        = locked[0] ?? null

  return {
    tasksCompleted,
    accessories,
    unlockedAccessories: unlocked,
    nextAccessory: next,
    tasksUntilNext: next ? next.tasksRequired - tasksCompleted : 0,
  }
}

// Returns the single accessory just newly earned after completing a task
export function justEarnedAccessory(
  previousCount: number,
  newCount: number,
  chosenEmojis: string[] = DEFAULT_ACCESSORIES
): Accessory | null {
  const accessories = buildAccessories(chosenEmojis)
  const wasBefore   = accessories.filter(a => previousCount >= a.tasksRequired)
  const isNow       = accessories.filter(a => newCount >= a.tasksRequired)
  const newlyEarned = isNow.filter(a => !wasBefore.find(b => b.emoji === a.emoji))
  return newlyEarned[newlyEarned.length - 1] ?? null
}
