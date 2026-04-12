'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PinEntry } from '@/components/player/PinEntry'

interface Profile {
  id: string
  name: string
  avatar_url: string | null
}

export function PlayEntryClient() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selected, setSelected] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/player/profiles')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!data) {
          router.replace('/app/dashboard')
          return
        }
        setProfiles(data.profiles)
        // Auto-select if there's only one profile
        if (data.profiles.length === 1) setSelected(data.profiles[0])
        setLoading(false)
      })
  }, [router])

  async function validatePin(pin: string): Promise<boolean> {
    if (!selected) return false
    const res = await fetch('/api/profiles/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: selected.id, pin }),
    })
    return res.ok
  }

  function handleSuccess() {
    if (!selected) return
    sessionStorage.setItem('lulu_active_profile', selected.id)
    router.push('/play/today')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-muted text-sm animate-pulse">Loading…</p>
      </div>
    )
  }

  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-bold text-brand-600">Lulu</h1>
          <p className="text-text-secondary text-lg">Who's here today?</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="flex items-center gap-4 rounded-2xl border-2 border-border bg-surface-raised px-5 py-4 text-left active:bg-surface-subtle transition-colors"
            >
              <span className="text-4xl">{p.avatar_url ?? '😊'}</span>
              <span className="text-xl font-semibold text-text-primary">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <PinEntry
      childName={selected.name}
      validatePin={validatePin}
      onSuccess={handleSuccess}
    />
  )
}
