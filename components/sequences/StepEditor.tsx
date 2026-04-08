'use client'

import { useRef } from 'react'
import { STARTER_SOUNDS, SOUNDS_BY_CUE_TYPE } from '@/lib/sounds'
import type { CueType, StepType } from '@/lib/types/sequence'

interface Step {
  id: string
  title: string | null
  step_type: StepType
  visual_url: string | null
  audio_url: string | null
  cue_type: CueType | null
  duration_seconds: number | null
  help_text: string | null
}

interface Props {
  step: Step
  sequenceId: string
  onChange: (updates: Partial<Step>) => void
}

const CUE_OPTIONS: { value: CueType; label: string; desc: string }[] = [
  { value: 'start',       label: '▶ Start',       desc: 'Plays at the beginning of this step' },
  { value: 'transition',  label: '→ Moving on',   desc: 'Signals a change or movement' },
  { value: 'pacing',      label: '⏱ Pacing',      desc: 'Helps keep pace during the step' },
  { value: 'calm',        label: '🌿 Calm',        desc: 'For calming or breathing steps' },
  { value: 'celebration', label: '⭐ Celebrate',   desc: 'Plays on completion' },
]

export function StepEditor({ step, sequenceId, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLInputElement>(null)

  // Visual upload — sends to /api/upload, gets back a URL
  async function handleVisualUpload(file: File) {
    const form = new FormData()
    form.append('file', file)
    form.append('type', 'visual')
    form.append('sequenceId', sequenceId)

    const res = await fetch('/api/upload', { method: 'POST', body: form })
    if (res.ok) {
      const { url } = await res.json()
      onChange({ visual_url: url })
    }
  }

  // Parent voice upload
  async function handleAudioUpload(file: File) {
    const form = new FormData()
    form.append('file', file)
    form.append('type', 'audio')
    form.append('sequenceId', sequenceId)

    const res = await fetch('/api/upload', { method: 'POST', body: form })
    if (res.ok) {
      const { url } = await res.json()
      onChange({ audio_url: url })
    }
  }

  const soundsForCue = step.cue_type ? SOUNDS_BY_CUE_TYPE[step.cue_type] ?? [] : []

  return (
    <div className="space-y-5">
      {/* Step name (adult-only label) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Step name <span className="font-normal">(your reference — not shown to child)</span>
        </label>
        <input
          type="text"
          value={step.title ?? ''}
          onChange={e => onChange({ title: e.target.value })}
          placeholder="e.g. Put on shoes"
          className="w-full rounded-xl border border-border bg-surface-raised px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>

      {/* Visual */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Picture or photo
        </label>
        {step.visual_url ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={step.visual_url}
              alt="Step visual"
              className="w-20 h-20 rounded-xl object-cover border border-border"
            />
            <div className="space-y-1">
              <button
                onClick={() => fileRef.current?.click()}
                className="block text-sm text-brand-600 hover:underline"
              >
                Change picture
              </button>
              <button
                onClick={() => onChange({ visual_url: null })}
                className="block text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-border py-6 text-sm text-text-muted hover:bg-surface-subtle hover:border-brand-300 transition-colors"
          >
            📷 Upload a picture
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) handleVisualUpload(file)
          }}
        />
      </div>

      {/* What Lulu says */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          What Lulu says <span className="font-normal">(read aloud to your child)</span>
        </label>
        <textarea
          value={step.help_text ?? ''}
          onChange={e => onChange({ help_text: e.target.value })}
          placeholder="e.g. Time to put on your shoes! Sit down and put them on your feet."
          rows={2}
          className="w-full rounded-xl border border-border bg-surface-raised px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
        />
        <p className="text-xs text-text-muted">This is also shown as help text when your child taps Help.</p>
      </div>

      {/* Parent voice recording */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Your voice <span className="font-normal">(optional — replaces Lulu voice for this step)</span>
        </label>
        {step.audio_url ? (
          <div className="flex items-center gap-3">
            <audio controls src={step.audio_url} className="h-8 flex-1" />
            <button
              onClick={() => onChange({ audio_url: null })}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            onClick={() => audioRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-border py-3 text-sm text-text-muted hover:bg-surface-subtle hover:border-brand-300 transition-colors"
          >
            🎙 Upload your voice recording
          </button>
        )}
        <input
          ref={audioRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) handleAudioUpload(file)
          }}
        />
      </div>

      {/* Sound cue */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Sound cue <span className="font-normal">(optional)</span>
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {CUE_OPTIONS.map(cue => (
            <button
              key={cue.value}
              type="button"
              onClick={() => onChange({ cue_type: step.cue_type === cue.value ? null : cue.value })}
              className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors ${
                step.cue_type === cue.value
                  ? 'border-brand-400 bg-brand-50'
                  : 'border-border bg-surface-raised hover:bg-surface-subtle'
              }`}
            >
              <span className="text-sm font-medium text-text-primary w-24">{cue.label}</span>
              <span className="text-xs text-text-muted">{cue.desc}</span>
            </button>
          ))}
        </div>
        {step.cue_type && soundsForCue.length > 0 && (
          <p className="text-xs text-text-muted">
            Plays: <strong>{soundsForCue[0].label}</strong> — or upload your own voice above to replace it.
          </p>
        )}
      </div>

      {/* Timer */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Timer <span className="font-normal">(optional — how long for this step)</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={5}
            max={3600}
            value={step.duration_seconds ?? ''}
            onChange={e => onChange({ duration_seconds: e.target.value ? Number(e.target.value) : null })}
            placeholder="—"
            className="w-24 rounded-xl border border-border bg-surface-raised px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-400 text-center"
          />
          <span className="text-sm text-text-muted">seconds</span>
          {step.duration_seconds && (
            <span className="text-sm text-text-secondary">
              ({Math.floor(step.duration_seconds / 60)}m {step.duration_seconds % 60}s)
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
