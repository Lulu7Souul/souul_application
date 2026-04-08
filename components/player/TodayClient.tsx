'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useActiveProfile } from '@/lib/useActiveProfile'
import { RewardChart } from '@/components/player/RewardChart'
import { DailySummary } from '@/components/player/DailySummary'
import { calculateDailyReward } from '@/lib/rewards'
import type { DailyReward } from '@/lib/rewards'

interface Sequence {
  id: string
  title: string
  type: string
}

interface Profile {
  name: string
  avatar_url: string | null
}

const TYPE_EMOJI: Record<string, string> = {
  routine: '📋', story: '📖', practice: '✏️', calm: '🌿',
}

const TYPE_BG: Record<string, string> = {
  routine:  'bg-brand-50  border-brand-200',
  story:    'bg-calm-50   border-calm-200',
  practice: 'bg-warm-50   border-warm-200',
  calm:     'bg-brand-50  border-brand-100',
}

export function TodayClient() {
  const router = useRouter()
  const { profileId, ready } = useActiveProfile()
  const [sequences, setSequences]     = useState<Sequence[]>([])
  const [profile, setProfile]         = useState<Profile | null>(null)
  const [dailyReward, setDailyReward] = useState<DailyReward>(calculateDailyReward(0))
  const [loading, setLoading]         = useState(true)
  const [showSummary, setShowSummary] = useState(false)
  const [exitPin, setExitPin]         = useState('')
  const [showExit, setShowExit]       = useState(false)
  const [exitError, setExitError]     = useState(false)
  const [exiting, setExiting]         = useState(false)

  useEffect(() => {
    if (!ready || !profileId) return

    async function load() {
      const [todayRes, rewardRes] = await Promise.all([
        fetch(`/api/player/today?profileId=${profileId}`),
        fetch(`/api/rewards/today?profileId=${profileId}`),
      ])

      if (todayRes.ok) {
        const data = await todayRes.json()
        setSequences(data.sequences)
        setProfile(data.profile)
      }

      if (rewardRes.ok) {
        const data = await rewardRes.json()
        setDailyReward(calculateDailyReward(data.tasksCompleted))
      }

      setLoading(false)
    }

    load()
  }, [ready, profileId])

  async function handleExit(pin: string) {
    if (pin.length !== 4) return
    setExiting(true)

    const res = await fetch('/api/profiles/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, pin }),
    })

    if (res.ok) {
      // Show daily summary before fully exiting
      setShowExit(false)
      setShowSummary(true)
    } else {
      setExitError(true)
      setExitPin('')
      setExiting(false)
    }
  }

  function completeSummaryExit() {
    sessionStorage.removeItem('lulu_active_profile')
    router.replace('/app/dashboard')
  }

  if (!ready || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-4xl animate-pulse">🌟</div>
      </div>
    )
  }

  // Daily summary screen — shown after PIN verified, before returning to parent
  if (showSummary && profile) {
    return (
      <DailySummary
        childName={profile.name}
        avatarEmoji={profile.avatar_url ?? '🌟'}
        reward={dailyReward}
        onClose={completeSummaryExit}
      />
    )
  }

  // Exit PIN overlay
  if (showExit) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
        <p className="text-xl font-semibold text-text-primary">Enter your PIN to exit</p>

        <div className="flex gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-5 h-5 rounded-full border-2 transition-colors ${
              exitPin.length > i
                ? exitError ? 'bg-red-400 border-red-400' : 'bg-brand-500 border-brand-500'
                : 'border-border'
            }`} />
          ))}
        </div>

        {exitError && (
          <p className="text-red-500 text-sm" role="alert">Incorrect PIN. Try again.</p>
        )}

        <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
          {([1,2,3,4,5,6,7,8,9,null,0,'del'] as const).map((d, i) => {
            if (d === null) return <div key={i} />
            return (
              <button
                key={i}
                disabled={exiting}
                onClick={() => {
                  if (d === 'del') { setExitPin(p => p.slice(0,-1)); setExitError(false); return }
                  const next = exitPin + String(d)
                  setExitPin(next)
                  setExitError(false)
                  if (next.length === 4) handleExit(next)
                }}
                className="h-16 rounded-2xl text-xl font-semibold bg-surface-raised border-2 border-border text-text-primary active:bg-surface-subtle transition-colors disabled:opacity-40"
              >
                {d === 'del' ? '⌫' : d}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => { setShowExit(false); setExitPin(''); setExitError(false) }}
          className="text-text-muted text-sm hover:text-text-secondary mt-2"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-8 pb-3">
        <div className="flex items-center gap-3">
          {profile?.avatar_url && (
            <span className="text-4xl">{profile.avatar_url}</span>
          )}
          <div>
            <p className="text-sm text-text-muted">Hi,</p>
            <p className="text-2xl font-bold text-text-primary leading-tight">
              {profile?.name}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowExit(true)}
          className="text-text-muted text-xs border border-border rounded-xl px-3 py-2 hover:bg-surface-subtle transition-colors"
          aria-label="Exit child mode"
        >
          Exit
        </button>
      </div>

      {/* Reward chart */}
      {profile && (
        <RewardChart reward={dailyReward} childName={profile.name} />
      )}

      <p className="px-5 text-text-secondary text-base mb-3">
        What would you like to do today?
      </p>

      {/* Sequence cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
        {sequences.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
            <span className="text-6xl">🌟</span>
            <p className="text-text-secondary text-lg">No routines ready yet.</p>
            <p className="text-text-muted text-sm">Ask a grown-up to set one up for you.</p>
          </div>
        ) : (
          sequences.map(seq => (
            <button
              key={seq.id}
              onClick={() => router.push(`/play/${seq.id}`)}
              className={`w-full flex items-center gap-5 rounded-2xl border-2 px-5 py-5 text-left active:scale-[0.98] transition-all ${TYPE_BG[seq.type] ?? 'bg-surface-raised border-border'}`}
            >
              <span className="text-5xl">{TYPE_EMOJI[seq.type] ?? '📋'}</span>
              <span className="text-xl font-bold text-text-primary leading-snug">
                {seq.title}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
