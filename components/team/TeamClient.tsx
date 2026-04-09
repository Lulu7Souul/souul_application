'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TeamMember {
  id: string
  member_email: string
  permission: 'view' | 'edit'
  invited_at: string
  accepted_at: string | null
}

interface Props {
  members: TeamMember[]
}

const PERMISSION_LABEL: Record<string, string> = {
  view: 'Can view',
  edit: 'Can view & edit',
}

export function TeamClient({ members }: Props) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState<'view' | 'edit'>('view')
  const [sending, setSending] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleInvite() {
    setError('')
    setSuccess('')
    if (!email.trim()) { setError('Please enter an email address.'); return }
    setSending(true)

    const res = await fetch('/api/team/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberEmail: email.trim(), permission }),
    })

    setSending(false)

    if (res.ok) {
      setEmail('')
      setSuccess('Invite sent! They\'ll receive an email with a link to accept.')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong. Please try again.')
    }
  }

  async function handleRemove(id: string) {
    setRemoving(id)
    await fetch(`/api/team/${id}`, { method: 'DELETE' })
    setRemoving(null)
    router.refresh()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Team</h1>
        <p className="text-text-secondary mt-1">
          Invite one trusted adult to help manage routines — a partner, grandparent, or teacher.
        </p>
      </div>

      {/* Current members */}
      {members.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Current team
          </h2>
          {members.map(m => (
            <div
              key={m.id}
              className="flex items-center gap-4 rounded-xl bg-surface-raised border border-border px-4 py-4"
            >
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm flex-shrink-0">
                {m.member_email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">{m.member_email}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text-muted">{PERMISSION_LABEL[m.permission]}</span>
                  <span className="text-text-muted">·</span>
                  {m.accepted_at ? (
                    <span className="inline-flex items-center gap-1 text-xs text-calm-500 font-medium">
                      ✓ Active
                    </span>
                  ) : (
                    <span className="text-xs text-warm-500 font-medium">Invite pending</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemove(m.id)}
                disabled={removing === m.id}
                className="text-text-muted hover:text-red-500 transition-colors p-1 disabled:opacity-40"
                aria-label={`Remove ${m.member_email}`}
              >
                {removing === m.id ? '…' : '✕'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Invite form */}
      {members.length < 1 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Invite someone
          </h2>

          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); setSuccess('') }}
              placeholder="their@email.com"
              className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-400"
            />

            <div className="flex gap-2">
              {(['view', 'edit'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPermission(p)}
                  className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    permission === p
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-border bg-surface-raised text-text-secondary hover:bg-surface-subtle'
                  }`}
                >
                  {PERMISSION_LABEL[p]}
                </button>
              ))}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-brand-600">{success}</p>}

            <button
              onClick={handleInvite}
              disabled={sending}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 transition-colors disabled:opacity-60"
            >
              {sending ? 'Sending…' : 'Send invite'}
            </button>
          </div>

          <p className="text-xs text-text-muted">
            They'll receive an email with a link to accept. You can remove them at any time.
            Free plan allows 1 team member.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-surface-subtle border border-border px-5 py-4">
          <p className="text-sm text-text-secondary">
            You've reached the limit of 1 team member on the Free plan.
            Remove the current member to invite someone else, or upgrade for more.
          </p>
        </div>
      )}
    </div>
  )
}
