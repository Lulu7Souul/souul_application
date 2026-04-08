'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepEditor } from '@/components/sequences/StepEditor'
import type { CueType, StepType } from '@/lib/types/sequence'

interface Step {
  id: string
  order_index: number
  title: string | null
  step_type: StepType
  visual_url: string | null
  audio_url: string | null
  cue_type: CueType | null
  duration_seconds: number | null
  help_text: string | null
}

interface Sequence {
  id: string
  title: string
  type: string
  is_published: boolean
  completion_action: string
  reward_text: string | null
  child_profile_id: string | null
  steps: Step[]
}

interface Profile {
  id: string
  name: string
  avatar_url: string
}

interface Props {
  sequence: Sequence
  profiles: Profile[]
}

export function SequenceBuilder({ sequence, profiles }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(sequence.title)
  const [steps, setSteps] = useState<Step[]>(sequence.steps)
  const [profileId, setProfileId] = useState(sequence.child_profile_id ?? profiles[0]?.id ?? '')
  const [rewardText, setRewardText] = useState(sequence.reward_text ?? '')
  const [expandedStep, setExpandedStep] = useState<string | null>(
    steps.length === 0 ? null : steps[0].id
  )
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')

  const MAX_STEPS = 10  // Warn at 6, hard cap at 10 for early years

  function addStep() {
    const newStep: Step = {
      id: `new-${Date.now()}`,
      order_index: steps.length + 1,
      title: '',
      step_type: 'standard',
      visual_url: null,
      audio_url: null,
      cue_type: 'transition',
      duration_seconds: null,
      help_text: '',
    }
    setSteps(s => [...s, newStep])
    setExpandedStep(newStep.id)
  }

  function removeStep(stepId: string) {
    setSteps(s => {
      const filtered = s.filter(step => step.id !== stepId)
      // Re-index order
      return filtered.map((step, i) => ({ ...step, order_index: i + 1 }))
    })
    setExpandedStep(null)
  }

  function updateStep(stepId: string, updates: Partial<Step>) {
    setSteps(s => s.map(step => step.id === stepId ? { ...step, ...updates } : step))
  }

  function moveStep(stepId: string, direction: 'up' | 'down') {
    setSteps(s => {
      const idx = s.findIndex(step => step.id === stepId)
      if (idx === -1) return s
      const newIdx = direction === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= s.length) return s
      const next = [...s]
      ;[next[idx], next[newIdx]] = [next[newIdx], next[idx]]
      return next.map((step, i) => ({ ...step, order_index: i + 1 }))
    })
  }

  async function save(publish: boolean) {
    if (!title.trim()) { setError('Please give this routine a name.'); return }
    if (steps.length === 0) { setError('Add at least one step.'); return }

    publish ? setPublishing(true) : setSaving(true)
    setError('')

    const res = await fetch(`/api/sequences/${sequence.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        child_profile_id: profileId,
        reward_text: rewardText || null,
        is_published: publish,
        steps: steps.map(({ id, ...step }) => ({
          ...step,
          // New steps have temp IDs starting with "new-" — send without id
          id: id.startsWith('new-') ? undefined : id,
        })),
      }),
    })

    if (!res.ok) {
      setError('Could not save. Please try again.')
      setSaving(false)
      setPublishing(false)
      return
    }

    router.push('/app/sequences')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="text-2xl font-bold text-text-primary bg-transparent border-b-2 border-transparent focus:border-brand-400 focus:outline-none w-full pb-1 transition-colors"
            placeholder="Routine name…"
            aria-label="Routine name"
          />
          <p className="text-xs text-text-muted mt-1 capitalize">{sequence.type}</p>
        </div>

        {/* Assign to child */}
        {profiles.length > 1 && (
          <select
            value={profileId}
            onChange={e => setProfileId(e.target.value)}
            className="rounded-xl border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.avatar_url} {p.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Steps ({steps.length})
          </h2>
          {steps.length >= 6 && steps.length < MAX_STEPS && (
            <span className="text-xs text-warm-600 bg-warm-50 border border-warm-200 rounded-lg px-2 py-1">
              Tip: shorter routines work best for young children
            </span>
          )}
        </div>

        {steps.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center">
            <p className="text-text-muted">No steps yet. Add your first step below.</p>
          </div>
        )}

        {steps.map((step, index) => (
          <div key={step.id} className="rounded-xl border border-border bg-surface-raised overflow-hidden">
            {/* Step header */}
            <div className="flex items-center gap-3 px-4 py-3">
              {/* Reorder */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveStep(step.id, 'up')}
                  disabled={index === 0}
                  className="text-text-muted hover:text-text-primary disabled:opacity-20 text-xs leading-none"
                  aria-label="Move step up"
                >▲</button>
                <button
                  onClick={() => moveStep(step.id, 'down')}
                  disabled={index === steps.length - 1}
                  className="text-text-muted hover:text-text-primary disabled:opacity-20 text-xs leading-none"
                  aria-label="Move step down"
                >▼</button>
              </div>

              <span className="text-sm font-bold text-text-muted w-5 text-center">{index + 1}</span>

              <button
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                className="flex-1 text-left font-medium text-text-primary text-sm truncate"
              >
                {step.title || `Step ${index + 1}`}
                {step.visual_url && ' 🖼'}
                {step.audio_url && ' 🔊'}
                {step.help_text && ' 💛'}
              </button>

              <button
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                className="text-text-muted text-sm"
              >
                {expandedStep === step.id ? '▲' : '▼'}
              </button>

              <button
                onClick={() => removeStep(step.id)}
                className="text-red-400 hover:text-red-600 text-sm transition-colors ml-1"
                aria-label={`Remove step ${index + 1}`}
              >
                ✕
              </button>
            </div>

            {/* Step editor — expands inline */}
            {expandedStep === step.id && (
              <div className="border-t border-border bg-surface px-4 py-4">
                <StepEditor
                  step={step}
                  sequenceId={sequence.id}
                  onChange={updates => updateStep(step.id, updates)}
                />
              </div>
            )}
          </div>
        ))}

        {/* Add step */}
        {steps.length < MAX_STEPS && (
          <button
            onClick={addStep}
            className="w-full rounded-xl border-2 border-dashed border-brand-200 py-3 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
          >
            + Add a step
          </button>
        )}
      </div>

      {/* Reward */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          Celebration message <span className="text-text-muted font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={rewardText}
          onChange={e => setRewardText(e.target.value)}
          placeholder="e.g. You did it! Time for a story!"
          className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 text-center" role="alert">{error}</p>
      )}

      {/* Save actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => save(false)}
          disabled={saving || publishing}
          className="flex-1 rounded-xl border-2 border-border px-4 py-3 font-medium text-text-primary hover:bg-surface-subtle transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save draft'}
        </button>
        <button
          onClick={() => save(true)}
          disabled={saving || publishing}
          className="flex-1 rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          {publishing ? 'Publishing…' : sequence.is_published ? 'Save & update' : 'Publish to Lulu'}
        </button>
      </div>
    </div>
  )
}
