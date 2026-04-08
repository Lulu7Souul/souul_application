'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { filterCalmVoices } from '@/lib/types/voice'
import { EmojiPicker } from '@/components/profiles/EmojiPicker'
import { DEFAULT_ACCESSORIES } from '@/lib/emoji-library'
import type { VoiceMode } from '@/lib/types/voice'

const AVATAR_EMOJIS = ['🌟', '🌈', '🦋', '🐢', '🦁', '🐬', '🌸', '🦉', '🐻', '🌙', '☀️', '🌿']

interface FormState {
  name: string
  avatar: string
  voiceMode: VoiceMode
  luluVoiceUri: string
  transitionNotice: boolean
  pin: string
  pinConfirm: string
  accessories: string[]  // 5 chosen emojis in order
}

const STEPS = [
  { label: 'About your child' },
  { label: 'Lulu\'s voice' },
  { label: 'Reward emojis' },
  { label: 'Child mode PIN' },
] as const

export function NewProfileForm({ isOnboarding }: { isOnboarding: boolean }) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<FormState>({
    name: '',
    avatar: '🌟',
    voiceMode: 'lulu',
    luluVoiceUri: '',
    transitionNotice: true,
    pin: '',
    pinConfirm: '',
    accessories: [...DEFAULT_ACCESSORIES],
  })

  useEffect(() => {
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
    if (form.pin.length !== 4) { setError('Please set a 4-digit PIN.'); return }
    if (form.pin !== form.pinConfirm) { setError('PINs do not match.'); return }

    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const res = await fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        avatar_url: form.avatar,
        audio_enabled: true,
        motion_enabled: true,
        communication_mode: 'symbols_only',
        voice_mode: form.voiceMode,
        lulu_voice_uri: form.luluVoiceUri,
        accessory_emojis: form.accessories,
        transition_notice: form.transitionNotice,
        pin: form.pin,
      }),
    })

    if (!res.ok) { setError('Something went wrong. Please try again.'); setLoading(false); return }

    router.push(isOnboarding ? '/app/sequences?onboarding=true' : '/app/profiles')
    router.refresh()
  }

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, idx) => {
          const n = (idx + 1) as 1 | 2 | 3 | 4
          return (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === n ? 'bg-brand-500 text-white' :
                step > n   ? 'bg-brand-100 text-brand-600' :
                             'bg-surface-subtle text-text-muted'
              }`}>
                {step > n ? '✓' : n}
              </div>
              {n < 4 && <div className={`h-px w-6 ${step > n ? 'bg-brand-300' : 'bg-border'}`} />}
            </div>
          )
        })}
        <span className="ml-2 text-sm text-text-muted">{STEPS[step - 1].label}</span>
      </div>

      {/* ── Step 1: Name & Avatar ── */}
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
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            onClick={() => {
              if (!form.name.trim()) { setError('Please enter your child\'s name.'); return }
              setError(''); setStep(2)
            }}
            className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* ── Step 2: Voice ── */}
      {step === 2 && (
        <div className="space-y-6">
          <p className="text-sm text-text-secondary">
            Lulu can guide {form.name} through each step with a voice.
          </p>

          <div className="space-y-3">
            {([
              { mode: 'lulu'   as VoiceMode, label: 'Lulu\'s voice', desc: 'A calm, clear voice reads each step aloud' },
              { mode: 'parent' as VoiceMode, label: 'Your voice',    desc: 'Record your own voice for each step' },
              { mode: 'off'    as VoiceMode, label: 'No voice',      desc: 'Visuals and music only' },
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

          {form.voiceMode === 'lulu' && availableVoices.length > 1 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Choose a voice tone</label>
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

          {/* Transition notice toggle */}
          <button
            type="button"
            onClick={() => set('transitionNotice', !form.transitionNotice)}
            className={`w-full text-left rounded-xl border-2 px-4 py-4 transition-colors ${
              form.transitionNotice
                ? 'border-brand-500 bg-brand-50'
                : 'border-border bg-surface-raised hover:bg-surface-subtle'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-text-primary">Step transition notice</p>
                <p className="text-sm text-text-secondary mt-0.5">
                  A short "what's next" screen appears between steps so {form.name || 'your child'} can prepare
                </p>
              </div>
              {/* Toggle pill */}
              <div className={`relative w-12 h-7 rounded-full flex-shrink-0 transition-colors ${
                form.transitionNotice ? 'bg-brand-500' : 'bg-surface-subtle border border-border'
              }`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  form.transitionNotice ? 'left-6' : 'left-1'
                }`} />
              </div>
            </div>
          </button>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 rounded-xl border-2 border-border px-4 py-3 font-medium text-text-primary hover:bg-surface-subtle transition-colors">← Back</button>
            <button onClick={() => setStep(3)} className="flex-1 rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 transition-colors">Next →</button>
          </div>
        </div>
      )}

      {/* ── Step 3: Reward Emojis ── */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="space-y-1">
            <p className="text-sm text-text-secondary">
              Pick 5 emojis for {form.name}'s reward chart — one unlocks after each routine completed.
              Tap to choose, tap again to swap.
            </p>
          </div>

          <EmojiPicker
            selected={form.accessories}
            onChange={emojis => set('accessories', emojis)}
          />

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 rounded-xl border-2 border-border px-4 py-3 font-medium text-text-primary hover:bg-surface-subtle transition-colors">← Back</button>
            <button
              onClick={() => {
                if (form.accessories.length < 5) { setError('Please choose all 5 reward emojis.'); return }
                setError(''); setStep(4)
              }}
              className="flex-1 rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: PIN ── */}
      {step === 4 && (
        <div className="space-y-6">
          <p className="text-sm text-text-secondary">
            Set a 4-digit PIN to enter and exit child mode. Only you need it.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="pin" className="text-sm font-medium text-text-primary">Choose a PIN</label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={form.pin}
                onChange={e => set('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="••••"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="pin-confirm" className="text-sm font-medium text-text-primary">Confirm PIN</label>
              <input
                id="pin-confirm"
                type="password"
                inputMode="numeric"
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
            <button onClick={() => setStep(3)} className="flex-1 rounded-xl border-2 border-border px-4 py-3 font-medium text-text-primary hover:bg-surface-subtle transition-colors">← Back</button>
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
