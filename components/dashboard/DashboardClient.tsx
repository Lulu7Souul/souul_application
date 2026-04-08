'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  profileId: string
  profileName: string
}

// Handles the PIN entry to launch child mode — client component
export function DashboardClient({ profileId, profileName }: Props) {
  const router = useRouter()
  const [showPin, setShowPin] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'] as const

  async function handleDigit(digit: number | 'del' | null) {
    if (digit === null || checking) return

    if (digit === 'del') {
      setPin(p => p.slice(0, -1))
      setError(false)
      return
    }

    const newPin = pin + String(digit)
    setPin(newPin)
    setError(false)

    if (newPin.length === 4) {
      setChecking(true)
      const res = await fetch('/api/profiles/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, pin: newPin }),
      })

      if (res.ok) {
        // Store active profile in sessionStorage for child player
        sessionStorage.setItem('lulu_active_profile', profileId)
        router.push('/play/today')
      } else {
        setError(true)
        setPin('')
      }
      setChecking(false)
    }
  }

  if (!showPin) {
    return (
      <button
        onClick={() => setShowPin(true)}
        className="w-full rounded-2xl bg-brand-500 px-6 py-5 text-white font-bold text-lg hover:bg-brand-600 active:scale-98 transition-all"
      >
        ▶ Start {profileName}'s Lulu
      </button>
    )
  }

  return (
    <div className="rounded-2xl bg-surface-raised border border-border p-6 space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-text-primary">Enter your PIN to start child mode</p>
        <button onClick={() => { setShowPin(false); setPin(''); setError(false) }} className="text-text-muted hover:text-text-primary text-sm">
          Cancel
        </button>
      </div>

      {/* PIN dots */}
      <div className="flex justify-center gap-4">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 transition-colors ${
            pin.length > i
              ? error ? 'bg-red-400 border-red-400' : 'bg-brand-500 border-brand-500'
              : 'border-border'
          }`} />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-red-500" role="alert">Incorrect PIN. Try again.</p>
      )}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-2">
        {digits.map((digit, i) => {
          if (digit === null) return <div key={i} />
          return (
            <button
              key={i}
              onClick={() => handleDigit(digit)}
              disabled={checking}
              className="h-14 rounded-xl text-lg font-semibold bg-surface-subtle border border-border text-text-primary hover:bg-surface-raised active:scale-95 transition-all disabled:opacity-40"
            >
              {digit === 'del' ? '⌫' : digit}
            </button>
          )
        })}
      </div>
    </div>
  )
}
