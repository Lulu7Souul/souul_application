'use client'

import type { VoiceSettings } from '@/lib/types/voice'

// Speaks text using Web Speech API with Lulu's calm voice settings
export function speakWithLulu(text: string, settings: VoiceSettings): Promise<void> {
  return new Promise((resolve) => {
    if (settings.mode !== 'lulu' || !text || typeof window === 'undefined') {
      resolve()
      return
    }

    if (!window.speechSynthesis) {
      resolve()
      return
    }

    // Cancel anything currently speaking
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = settings.rate
    utterance.pitch = settings.pitch
    utterance.volume = settings.volume

    // Apply the selected voice if set
    if (settings.lulu_voice_uri) {
      const voices = window.speechSynthesis.getVoices()
      const voice = voices.find(v => v.voiceURI === settings.lulu_voice_uri)
      if (voice) utterance.voice = voice
    }

    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()  // Never block on voice error

    window.speechSynthesis.speak(utterance)
  })
}

// Plays a parent-recorded voice note from Supabase Storage URL
export async function playParentVoice(audioUrl: string, volume = 0.9): Promise<void> {
  return new Promise((resolve) => {
    try {
      const audio = new Audio(audioUrl)
      audio.volume = volume
      audio.onended = () => resolve()
      audio.onerror = () => resolve()
      audio.play().catch(() => resolve())
    } catch {
      resolve()
    }
  })
}

// Main voice handler for the player — called on each step load
// Sequence: voice → then music cue (handled by caller after this resolves)
export async function playStepVoice(
  settings: VoiceSettings,
  voiceScript: string | undefined,
  parentVoiceUrl: string | undefined,
): Promise<void> {
  if (settings.mode === 'off') return

  if (settings.mode === 'parent' && parentVoiceUrl) {
    await playParentVoice(parentVoiceUrl, settings.volume)
    return
  }

  if (settings.mode === 'lulu' && voiceScript) {
    await speakWithLulu(voiceScript, settings)
    return
  }
}
