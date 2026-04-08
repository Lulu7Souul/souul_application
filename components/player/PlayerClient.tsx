'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useActiveProfile } from '@/lib/useActiveProfile'
import { SequencePlayer } from '@/components/player/SequencePlayer'
import { CelebrationScreen } from '@/components/player/CelebrationScreen'
import { calculateDailyReward, justEarnedAccessory } from '@/lib/rewards'
import type { Sequence } from '@/lib/types/sequence'
import type { VoiceSettings } from '@/lib/types/voice'
import type { SessionLogData } from '@/components/player/SequencePlayer'
import type { DailyReward, Accessory } from '@/lib/rewards'

type PlayerState = 'loading' | 'playing' | 'celebrating' | 'error'

interface FullSequence extends Sequence {
  reward_text?: string
  reward_image_url?: string
}

interface ProfileData {
  name: string
  avatar_url: string | null
  voice_mode: string
  lulu_voice_uri: string | null
  calm_sequence_id: string | null
  accessory_emojis?: string[]
}

export function PlayerClient({ sequenceId }: { sequenceId: string }) {
  const router = useRouter()
  const { profileId, ready } = useActiveProfile()
  const [state, setState] = useState<PlayerState>('loading')
  const [sequence, setSequence] = useState<FullSequence | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    mode: 'lulu', rate: 0.85, pitch: 1.0, volume: 0.9,
  })
  const [dailyReward, setDailyReward] = useState<DailyReward>(calculateDailyReward(0))
  const [newlyEarned, setNewlyEarned] = useState<Accessory | null>(null)

  useEffect(() => {
    if (!ready || !profileId) return

    async function load() {
      const [seqRes, rewardRes] = await Promise.all([
        fetch(`/api/player/sequence?id=${sequenceId}&profileId=${profileId}`),
        fetch(`/api/rewards/today?profileId=${profileId}`),
      ])

      if (!seqRes.ok) { setState('error'); return }

      const seqData = await seqRes.json()
      const rewardData = rewardRes.ok ? await rewardRes.json() : { tasksCompleted: 0 }

      setSequence(seqData.sequence)
      setProfile(seqData.profile)
      setVoiceSettings({
        mode: seqData.profile.voice_mode ?? 'lulu',
        lulu_voice_uri: seqData.profile.lulu_voice_uri ?? undefined,
        rate: 0.85, pitch: 1.0, volume: 0.9,
      })
      const chosenEmojis = seqData.profile.accessory_emojis ?? undefined
      setDailyReward(calculateDailyReward(rewardData.tasksCompleted, chosenEmojis))
      setState('playing')
    }

    load()
  }, [ready, profileId, sequenceId])

  async function handleComplete(log: SessionLogData) {
    // Post session log
    await fetch('/api/session-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sequenceId, profileId,
        completedAt: new Date().toISOString(),
        ...log,
      }),
    })

    // Recalculate reward after this completion
    const chosenEmojis = profile?.accessory_emojis ?? undefined
    const prevCount    = dailyReward.tasksCompleted
    const newCount     = prevCount + 1
    const newReward    = calculateDailyReward(newCount, chosenEmojis)
    const earned       = justEarnedAccessory(prevCount, newCount, chosenEmojis)

    setDailyReward(newReward)
    setNewlyEarned(earned)

    if (sequence?.completion_action === 'return_to_today') {
      router.replace('/play/today')
      return
    }

    setState('celebrating')
  }

  function handleBreak() {
    const returnTo = `/play/${sequenceId}`
    if (profile?.calm_sequence_id) {
      router.push(`/play/${profile.calm_sequence_id}?returnTo=${encodeURIComponent(returnTo)}&mode=calm`)
    } else {
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
        avatarEmoji={profile.avatar_url ?? '🌟'}
        rewardText={sequence.reward_text}
        rewardImageUrl={sequence.reward_image_url}
        dailyReward={dailyReward}
        newlyEarned={newlyEarned}
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
