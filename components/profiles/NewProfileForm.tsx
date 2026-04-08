'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { filterCalmVoices } from '@/lib/types/voice'
import type { VoiceMode } from '@/lib/types/voice'

const AVATAR_EMOJIS = ['🌟', '🌈', '🦋', '🐢', '🦁', '🐬', '🌸', '🦉', '🐻', '🌙', '☀️', '🌿']

interface FormState {
  name: string
  avatar: string
  voiceMode: VoiceMode
  luluVoiceUri: string
  audioEnabled: boolean
  motionEnabled: boolean
  pin: string
  pinConfirm: string
}

export function NewProfileForm({ isOnboarding }: { isOnboarding: boolean }) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<FormState>({
    name: '',
    avatar: '🌟',
    voiceMode: 'lulu',
    luluVoiceUri: '',
    audioEnabled: true,
    motionEnabled: true,
    pin: '',
    pinConfirm: '',
  })

  useEffect(() => {
    // Load available voices for Lulu voice selection
    const loadVoices = () => {
      const voices = filterCalmVoices(window.speechSynthesis?.getVoices() ?? [])
      setAvailableVoices(voices)
      if (voices.length > 0 && !form.luluVoiceUri) {
        setForm(f => ({ ...f, luluVoiceUri: voices[0].voiceURI }))
      }
    }
    loadVoices()
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }))
    setError('')
  }

  async function handleSubmit() {
    if (form.pin.length !== 4) {
      setError('Please set a 4-digit PIN for child mode.')
      return
    }
    if (form.pin !== form.pinConfirm) {
      setError('PINs do not match. Please try again.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Hash the PIN server-side via API route
    const res = await fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        avatar_url: form.avatar,
        audio_enabled: form.audioEnabled,
        motion_enabled: form.motionEnabled,
        communication_mode: 'symbols_only',  // default for early years
        voice_mode: form.voiceMode,
        lulu_voice_uri: form.luluVoiceUri,
        pin: form.pin,
      }),
    })

    if (!res.ok) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    router.push(isOnboarding ? '/app/sequences?onboarding=true' : '/app/profiles')
    router.refresh()
  }

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {([1, 2, 3] as const).map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step === s ? 'bg-brand-500 text-white' :
              step > s ? 'bg-brand-100 text-brand-600' :
              'bg-surface-subtle text-text-muted'
            }`}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && <div className={`h-px w-8 ${step > s ? 'bg-brand-300' : 'bg-border'}`} />}
          </div>
        ))}
        <span className="ml-2 text-sm text-text-muted">
          {step === 1 ? 'About your child' : step === 2 ? 'Lulu\'s voice' : 'Child mode PIN'}
        </span>
      </div>

      {/* Step 1 — Name and avatar */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="child-name" className="text-sm font-medium text-text-primary">
              What's your child's name?
            </label>
            <input
              id="child-name"
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-400 text-lg"
              placeholder="Child's name"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-text-primary">Choose an avatar</p>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => set('avatar', emoji)}
                  className={`h-12 w-full rounded-xl text-2xl transition-all ${
                    form.avatar === emoji
                      ? 'bg-brand-100 ring-2 ring-brand-500 scale-110'
                      : 'bg-surface-subtle hover:bg-surface-raised'
                  }`}
                  aria-label={`Select ${emoji} avatar`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (!form.name.trim()) { setError('Please enter your child\'s name.'); return }
              setError('')
              setStep(2)
            }}
            className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            Next →
          </button>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </div>
      )}

      {/* Step 2 — Voice */}
      {step === 2 && (
        <div className="space-y-6">
          <p className="text-sm text-text-secondary">
            Lulu can guide {form.name} through each step with a voice. Choose what works best.
          </p>

          <div className="space-y-3">
            {([
              { mode: 'lulu' as VoiceMode, label: 'Lulu\'s voice', desc: 'A calm, clear voice reads each step aloud' },
              { mode: 'parent' as VoiceMode, label: 'Your voice', desc: 'Record your own voice for each step (most personal)' },
              { mode: 'off' as VoiceMode, label: 'No voice', desc: 'Visuals and music only — no spoken words' },
            ]).map(({ mode, label, desc }) => (
              <button
                key={mode}
                type="button"
                onClick={() => set('voiceMode', mode)}
                className={`w-full text-left rounded-xl border-2 px-4 py-4 transition-colors ${
                  form.voiceMode === mode
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-border bg-surface-raised hover:bg-surface-subtle'
                }`}
              >
                <p className="font-semibold text-text-primary">{label}</p>
                <p className="text-sm text-text-secondary mt-0.5">{desc}</p>
              </button>
            ))}
          </div>

          {/* Voice picker for Lulu mode */}
          {form.voiceMode === 'lulu' && availableVoices.length > 1 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Choose a voice
              </label>
              <select
                value={form.luluVoiceUri}
                onChange={e => set('luluVoiceUri', e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {availableVoices.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border-2 border-border px-4 py-3 font-medium text-text-primary hover:bg-surface-subtle transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-2 flex-1 rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — PIN */}
      {step === 3 && (
        <div className="space-y-6">
          <p className="text-sm text-text-secondary">
            Set a 4-digit PIN to enter and exit child mode. {form.name} won't need it — only you do.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="pin" className="text-sm font-medium text-text-primary">
                Choose a PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                value={form.pin}
                onChange={e => set('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="••••"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pin-confirm" className="text-sm font-medium text-text-primary">
                Confirm PIN
              </label>
              <input
                id="pin-confirm"
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                value={form.pinConfirm}
                onChange={e => set('pinConfirm', e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="••••"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 rounded-xl border-2 border-border px-4 py-3 font-medium text-text-primary hover:bg-surface-subtle transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || form.pin.length < 4}
              className="flex-1 rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 transition-colors disabled:opacity-60"
            >
              {loading ? 'Saving…' : isOnboarding ? 'Meet Lulu →' : 'Save profile'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
