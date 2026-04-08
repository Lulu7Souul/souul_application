// Lulu voice system types

export type VoiceMode = 'parent' | 'lulu' | 'off'

export interface VoiceSettings {
  mode: VoiceMode
  // For 'lulu' mode: the Web Speech API voice URI selected by parent
  // Populated from window.speechSynthesis.getVoices() filtered to calm voices
  lulu_voice_uri?: string
  rate: number   // 0.85 default — slightly slower for early years comprehension
  pitch: number  // 1.0 default
  volume: number // 0.9 default
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  mode: 'lulu',
  rate: 0.85,
  pitch: 1.0,
  volume: 0.9,
}

// Filters system voices to find warm, calm options for early years
// Prefers: female voices, English, slower-sounding names
export function filterCalmVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const englishVoices = voices.filter(v =>
    v.lang.startsWith('en') && !v.name.toLowerCase().includes('novelty')
  )
  // Prefer voices with warm-sounding names (heuristic — works on most platforms)
  const preferred = englishVoices.filter(v => {
    const name = v.name.toLowerCase()
    return (
      name.includes('samantha') ||
      name.includes('karen') ||
      name.includes('moira') ||
      name.includes('serena') ||
      name.includes('victoria') ||
      name.includes('fiona') ||
      name.includes('google uk english female') ||
      name.includes('microsoft zira') ||
      name.includes('microsoft hazel')
    )
  })
  return preferred.length > 0 ? preferred : englishVoices.slice(0, 5)
}
