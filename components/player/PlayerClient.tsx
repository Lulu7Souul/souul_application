'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useActiveProfile } from '@/lib/useActiveProfile'
import { SequencePlayer } from '@/components/player/SequencePlayer'
import { CelebrationScreen } from '@/components/player/CelebrationScreen'
import type { Sequence } from '@/lib/types/sequence'
import type { VoiceSettings } from '@/lib/types/voice'
import type { SessionLogData } from '@/components/player/SequencePlayer'

type PlayerState = 'loading' | 'playing' | 'celebrating' | 'error'

interface FullSequence extends Sequence {
  reward_text?: string
  reward_image_url?: string
}

interface ProfileData {
  name: string
  voice_mode: string
  lulu_voice_uri: string | null
  calm_sequence_id: string | null
}

export function PlayerClient({ sequenceId }: { sequenceId: string }) {
  const router = useRouter()
  const { profileId, ready } = useActiveProfile()
  const [state, setState] = useState<PlayerState>('loading')
  const [sequence, setSequence] = useState<FullSequence | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    mode: 'lulu',
    rate: 0.85,
    pitch: 1.0,
    volume: 0.9,
  })

  useEffect(() => {
    if (!ready || !profileId) return

    async function load() {
      const res = await fetch(`/api/player/sequence?id=${sequenceId}&profileId=${profileId}`)
      if (!res.ok) { setState('error'); return }

      const data = await res.json()
      setSequence(data.sequence)
      setProfile(data.profile)

      // Build voice settings from profile preferences
      setVoiceSettings({
        mode: data.profile.voice_mode ?? 'lulu',
        lulu_voice_uri: data.profile.lulu_voice_uri ?? undefined,
        rate: 0.85,
        pitch: 1.0,
        volume: 0.9,
      })

      setState('playing')
    }

    load()
  }, [ready, profileId, sequenceId])

  async function handleComplete(log: SessionLogData) {
    // Log the session
    await fetch('/api/session-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sequenceId,
        profileId,
        completedAt: new Date().toISOString(),
        ...log,
      }),
    })

    if (sequence?.completion_action === 'return_to_today') {
      router.replace('/play/today')
      return
    }

    setState('celebrating')
  }

  function handleBreak() {
    // Navigate to the calm sequence, passing return URL
    const returnTo = `/play/${sequenceId}`
    if (profile?.calm_sequence_id) {
      router.push(`/play/${profile.calm_sequence_id}?returnTo=${encodeURIComponent(returnTo)}&mode=calm`)
    } else {
      // No calm sequence set — go to the default calm page
      router.push(`/play/calm?returnTo=${encodeURIComponent(returnTo)}`)
    }
  }

  if (state === 'loading' || !ready) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-5xl animate-pulse">🌟</div>
      </div>
    )
  }

  if (state === 'error' || !sequence || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center">
        <span className="text-5xl">😔</span>
        <p className="text-xl font-semibold text-text-primary">Something went wrong.</p>
        <button
          onClick={() => router.replace('/play/today')}
          className="rounded-2xl bg-brand-500 text-white px-8 py-4 font-bold text-lg"
        >
          Back to today
        </button>
      </div>
    )
  }

  if (state === 'celebrating') {
    return (
      <CelebrationScreen
        childName={profile.name}
        rewardText={sequence.reward_text}
        rewardImageUrl={sequence.reward_image_url}
        onContinue={() => router.replace('/play/today')}
      />
    )
  }

  return (
    <SequencePlayer
      sequence={sequence}
      voiceSettings={voiceSettings}
      onComplete={handleComplete}
      onBreak={handleBreak}
    />
  )
}
