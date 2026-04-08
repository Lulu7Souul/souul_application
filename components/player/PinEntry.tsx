'use client'

import { useState } from 'react'

interface PinEntryProps {
  childName: string
  onSuccess: () => void
  onError?: () => void
  validatePin: (pin: string) => Promise<boolean>
}

// PIN entry for child mode — large targets, no keyboard, numeric only
export function PinEntry({ childName, onSuccess, onError, validatePin }: PinEntryProps) {
  const [pin, setPin] = useState<string[]>([])
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'] as const

  async function handleDigit(digit: number | 'del' | null) {
    if (digit === null || checking) return

    if (digit === 'del') {
      setPin(prev => prev.slice(0, -1))
      setError(false)
      return
    }

    const newPin = [...pin, String(digit)]
    setPin(newPin)
    setError(false)

    if (newPin.length === 4) {
      setChecking(true)
      const valid = await validatePin(newPin.join(''))
      if (valid) {
        onSuccess()
      } else {
        setError(true)
        setPin([])
        onError?.()
      }
      setChecking(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
      {/* Child name */}
      <p className="text-2xl font-semibold text-text-primary">
        Hi, {childName}!
      </p>

      {/* PIN dots */}
      <div className="flex gap-4" aria-live="polite" aria-label={`${pin.length} of 4 digits entered`}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full border-2 transition-colors ${
              pin.length > i
                ? error
                  ? 'bg-red-400 border-red-400'
                  : 'bg-brand-500 border-brand-500'
                : 'border-border'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium" role="alert">
          Try again
        </p>
      )}

      {/* Numpad — large touch targets */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {digits.map((digit, i) => {
          if (digit === null) {
            return <div key={i} />
          }
          return (
            <button
              key={i}
              onClick={() => handleDigit(digit)}
              disabled={checking || (digit !== 'del' && pin.length >= 4)}
              className="h-16 rounded-2xl text-xl font-semibold bg-surface-raised border-2 border-border text-text-primary active:bg-surface-subtle transition-colors disabled:opacity-40"
              aria-label={digit === 'del' ? 'Delete last digit' : `Digit ${digit}`}
            >
              {digit === 'del' ? '⌫' : digit}
            </button>
          )
        })}
      </div>
    </div>
  )
}
