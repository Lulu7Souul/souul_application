// Bundled starter sound library
// All CC0 licensed — safe for global commercial use
// Paths are relative to /public/sounds/

import type { CueType } from '@/lib/types/sequence'

export interface SoundOption {
  id: string
  label: string
  path: string
  cue_type: CueType
  duration_ms: number  // approximate, for UI display
}

export const STARTER_SOUNDS: SoundOption[] = [
  // Start cues
  { id: 'ready-chime',  label: 'Ready chime',    path: '/sounds/start/ready-chime.mp3',       cue_type: 'start',       duration_ms: 1500 },
  { id: 'lets-go',      label: "Let's go",        path: '/sounds/start/lets-go.mp3',           cue_type: 'start',       duration_ms: 2000 },
  // Transition cues
  { id: 'moving-on',   label: 'Moving on',        path: '/sounds/transition/moving-on.mp3',    cue_type: 'transition',  duration_ms: 1200 },
  { id: 'next-step',   label: 'Next step',        path: '/sounds/transition/next-step.mp3',    cue_type: 'transition',  duration_ms: 1000 },
  // Calm cues
  { id: 'breathe-in',  label: 'Breathe in',       path: '/sounds/calm/breathe-in.mp3',         cue_type: 'calm',        duration_ms: 3000 },
  { id: 'breathe-out', label: 'Breathe out',      path: '/sounds/calm/breathe-out.mp3',        cue_type: 'calm',        duration_ms: 3000 },
  { id: 'calm-hum',    label: 'Calm hum',         path: '/sounds/calm/calm-hum.mp3',           cue_type: 'calm',        duration_ms: 5000 },
  // Celebration cues
  { id: 'well-done',   label: 'Well done',        path: '/sounds/celebration/well-done.mp3',   cue_type: 'celebration', duration_ms: 2000 },
  { id: 'great-job',   label: 'Great job',        path: '/sounds/celebration/great-job.mp3',   cue_type: 'celebration', duration_ms: 2500 },
  { id: 'stars',       label: 'Stars',            path: '/sounds/celebration/stars.mp3',       cue_type: 'celebration', duration_ms: 2000 },
  // Pacing cues
  { id: 'tick-soft',   label: 'Soft tick',        path: '/sounds/pacing/tick-soft.mp3',        cue_type: 'pacing',      duration_ms: 1000 },
  { id: 'pulse',       label: 'Gentle pulse',     path: '/sounds/pacing/pulse-gentle.mp3',     cue_type: 'pacing',      duration_ms: 1000 },
]

export const SOUNDS_BY_CUE_TYPE = STARTER_SOUNDS.reduce(
  (acc, sound) => {
    if (!acc[sound.cue_type]) acc[sound.cue_type] = []
    acc[sound.cue_type].push(sound)
    return acc
  },
  {} as Record<CueType, SoundOption[]>
)

// Play a sound safely — respects browser autoplay policies
// Must be called from a user gesture context in child player
export async function playSound(path: string, volume = 0.8): Promise<void> {
  try {
    const audio = new Audio(path)
    audio.volume = Math.min(1, Math.max(0, volume))
    await audio.play()
  } catch {
    // Silently fail — audio is enhancement, not critical path
    // Browser autoplay policies may block in some contexts
  }
}
