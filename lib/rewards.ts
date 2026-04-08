// Lulu Reward System
// Accessories are the 5 emojis chosen by the parent at profile setup.
// They unlock one per completed routine through the day.
// Design principle: a cosy gift, not a leaderboard.

import { getEmojiQuote, DEFAULT_ACCESSORIES } from '@/lib/emoji-library'

export interface Accessory {
  emoji: string
  quote: string
  tasksRequired: number
  isCrown?: boolean   // The crown is always the fixed 6th tier — never chosen by parent
}

// 👑 The Crown — permanent 6th tier. Always fixed. Never in the emoji picker.
// Earned only when 6 or more routines are completed in a single day.
// Visually special: orbiting sparkles, bounce-in animation, prominent on avatar.
export const CROWN: Accessory = {
  emoji: '👑',
  quote: 'You wore the crown today. What an incredible day!',
  tasksRequired: 6,
  isCrown: true,
}

// Build tiers 1–5 from parent's chosen emojis, then append the fixed Crown at tier 6
export function buildAccessories(chosenEmojis: string[]): Accessory[] {
  const emojis = chosenEmojis.length === 5 ? chosenEmojis : DEFAULT_ACCESSORIES
  const tiers: Accessory[] = emojis.map((emoji, i) => ({
    emoji,
    quote: getEmojiQuote(emoji),
    tasksRequired: i + 1,
  }))
  return [...tiers, CROWN]
}

export interface DailyReward {
  tasksCompleted: number
  accessories: Accessory[]          // all 6 tiers (5 chosen + crown)
  unlockedAccessories: Accessory[]  // earned so far today
  nextAccessory: Accessory | null
  tasksUntilNext: number
  hasCrown: boolean                 // true when 6+ tasks done today
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
    hasCrown: tasksCompleted >= CROWN.tasksRequired,
  }
}

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
