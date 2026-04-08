'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Sequence {
  id: string
  title: string
  type: string
  is_published: boolean
  updated_at: string
  child_profiles?: { name: string; avatar_url: string } | null
}

interface Template {
  id: string
  title: string
  type: string
  template_group: string | null
}

interface Profile {
  id: string
  name: string
  avatar_url: string
}

interface Props {
  mySequences: Sequence[]
  templates: Template[]
  profiles: Profile[]
  initialTab: 'mine' | 'templates'
  isOnboarding: boolean
}

const TYPE_EMOJI: Record<string, string> = {
  routine: '📋', story: '📖', practice: '✏️', calm: '🌿',
}

const TYPE_LABEL: Record<string, string> = {
  routine: 'Routine', story: 'Story', practice: 'Practice', calm: 'Calm',
}

type TemplateGroup = 'morning' | 'activity' | 'afternoon' | 'evening'

const GROUPS: { key: TemplateGroup; label: string; icon: string }[] = [
  { key: 'morning',   label: 'Morning',   icon: '🌅' },
  { key: 'activity',  label: 'Activity',  icon: '🎒' },
  { key: 'afternoon', label: 'Afternoon', icon: '🌤' },
  { key: 'evening',   label: 'Evening',   icon: '🌙' },
]

export function SequenceLibrary({ mySequences, templates, profiles, initialTab, isOnboarding }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'mine' | 'templates'>(
    isOnboarding || mySequences.length === 0 ? 'templates' : initialTab
  )
  const [group, setGroup] = useState<TemplateGroup>('morning')
  const [forking, setForking] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState(profiles[0]?.id ?? '')

  async function useTemplate(templateId: string) {
    if (!selectedProfile) return
    setForking(templateId)

    const res = await fetch('/api/sequences/fork', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, profileId: selectedProfile }),
    })

    if (res.ok) {
      const { id } = await res.json()
      router.push(`/app/sequences/${id}/builder`)
    } else {
      setForking(null)
    }
  }

  const groupedTemplates = templates.filter(t => t.template_group === group)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Routines</h1>
        <Link
          href="/app/sequences/new"
          className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          + Create new
        </Link>
      </div>

      {isOnboarding && (
        <div className="rounded-2xl bg-brand-50 border border-brand-100 px-5 py-4">
          <p className="text-brand-800 font-medium">Welcome to Lulu 👋</p>
          <p className="text-brand-600 text-sm mt-1">
            Start with one of Lulu's ready-made routines — you can change any step to suit your child.
          </p>
        </div>
      )}

      {/* Main tabs */}
      <div className="flex gap-1 bg-surface-subtle rounded-xl p-1">
        {(['mine', 'templates'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-surface-raised text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {t === 'mine' ? `My routines (${mySequences.length})` : "Lulu's templates"}
          </button>
        ))}
      </div>

      {/* My sequences */}
      {tab === 'mine' && (
        <div className="space-y-2">
          {mySequences.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border p-10 text-center space-y-3">
              <p className="text-3xl">📋</p>
              <p className="text-text-secondary font-medium">No routines yet</p>
              <p className="text-text-muted text-sm">Start from a template or create your own.</p>
              <button
                onClick={() => setTab('templates')}
                className="inline-block rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
              >
                Browse templates
              </button>
            </div>
          ) : (
            mySequences.map(seq => (
              <Link
                key={seq.id}
                href={`/app/sequences/${seq.id}`}
                className="flex items-center gap-4 rounded-xl bg-surface-raised border border-border px-4 py-4 hover:bg-surface-subtle transition-colors group"
              >
                <span className="text-2xl">{TYPE_EMOJI[seq.type] ?? '📋'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">{seq.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {seq.child_profiles?.avatar_url} {seq.child_profiles?.name}
                    {' · '}{TYPE_LABEL[seq.type]}
                    {' · '}{seq.is_published ? 'Active' : 'Draft'}
                  </p>
                </div>
                <span className="text-text-muted group-hover:text-text-secondary transition-colors">→</span>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Templates */}
      {tab === 'templates' && (
        <div className="space-y-4">
          {/* Profile selector */}
          {profiles.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">For:</span>
              <select
                value={selectedProfile}
                onChange={e => setSelectedProfile(e.target.value)}
                className="rounded-xl border border-border bg-surface-raised px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>{p.avatar_url} {p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Group tabs */}
          <div className="flex gap-1 bg-surface-subtle rounded-xl p-1">
            {GROUPS.map(g => (
              <button
                key={g.key}
                onClick={() => setGroup(g.key)}
                className={`flex-1 flex flex-col items-center gap-0.5 rounded-lg py-2 transition-colors ${
                  group === g.key
                    ? 'bg-surface-raised text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <span className="text-base leading-none">{g.icon}</span>
                <span className="text-xs font-medium">{g.label}</span>
              </button>
            ))}
          </div>

          {/* Template list for selected group */}
          <div className="space-y-2">
            {groupedTemplates.length === 0 ? (
              <p className="text-center text-text-muted py-8 text-sm">No templates in this group yet.</p>
            ) : (
              groupedTemplates.map(tpl => (
                <div
                  key={tpl.id}
                  className="flex items-center gap-4 rounded-xl bg-surface-raised border border-border px-4 py-4"
                >
                  <span className="text-2xl">{TYPE_EMOJI[tpl.type] ?? '📋'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary">{tpl.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">Lulu default · editable</p>
                  </div>
                  <button
                    onClick={() => useTemplate(tpl.id)}
                    disabled={forking === tpl.id || !selectedProfile}
                    className="rounded-lg bg-brand-50 border border-brand-200 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-100 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {forking === tpl.id ? 'Adding…' : 'Use this'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
