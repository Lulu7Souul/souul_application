'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Props {
  email: string
  fullName: string
  consentGivenAt: string | null
  plan: string
}

export function SettingsClient({ email, fullName, consentGivenAt, plan }: Props) {
  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      <AccountSection email={email} fullName={fullName} />
      <Divider />
      <PasswordSection />
      <Divider />
      <ConsentSection consentGivenAt={consentGivenAt} plan={plan} />
      <Divider />
      <DangerSection />
    </div>
  )
}

// ── Account ──────────────────────────────────────────────────

function AccountSection({ email, fullName: initial }: { email: string; fullName: string }) {
  const [name, setName] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function saveName() {
    if (name.trim() === initial) return
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase
      .from('user_profiles')
      .update({ full_name: name.trim() })
      .eq('id', (await supabase.auth.getUser()).data.user!.id)

    setSaving(false)
    if (error) { setError('Could not save. Please try again.'); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-text-primary">Account</h2>

      <div className="space-y-1">
        <label className="text-sm font-medium text-text-primary">Your name</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setSaved(false) }}
            onBlur={saveName}
            className="flex-1 rounded-xl border border-border bg-surface-raised px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button
            onClick={saveName}
            disabled={saving || name.trim() === initial}
            className="rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600 transition-colors disabled:opacity-40"
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-text-primary">Email</label>
        <p className="rounded-xl border border-border bg-surface-subtle px-4 py-3 text-text-muted text-sm">
          {email}
        </p>
        <p className="text-xs text-text-muted">
          To change your email, contact{' '}
          <a href="mailto:hello@heylulu.app" className="text-brand-600 hover:underline">hello@heylulu.app</a>.
        </p>
      </div>
    </section>
  )
}

// ── Password ─────────────────────────────────────────────────

function PasswordSection() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function changePassword() {
    setError('')
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return }
    if (next !== confirm) { setError('New passwords do not match.'); return }

    setSaving(true)
    const supabase = createClient()

    // Re-authenticate with current password first
    const { data: { user } } = await supabase.auth.getUser()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user!.email!,
      password: current,
    })
    if (signInError) { setSaving(false); setError('Current password is incorrect.'); return }

    const { error: updateError } = await supabase.auth.updateUser({ password: next })
    setSaving(false)
    if (updateError) { setError('Could not update password. Please try again.'); return }

    setCurrent(''); setNext(''); setConfirm('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-text-primary">Change password</h2>

      <div className="space-y-3 max-w-sm">
        <input
          type="password"
          value={current}
          onChange={e => setCurrent(e.target.value)}
          placeholder="Current password"
          className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <input
          type="password"
          value={next}
          onChange={e => setNext(e.target.value)}
          placeholder="New password (min. 8 characters)"
          className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Confirm new password"
          className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-400"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-brand-600">✓ Password updated.</p>}

        <button
          onClick={changePassword}
          disabled={saving || !current || !next || !confirm}
          className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 transition-colors disabled:opacity-40"
        >
          {saving ? 'Updating…' : 'Update password'}
        </button>
      </div>
    </section>
  )
}

// ── Consent & data ───────────────────────────────────────────

function ConsentSection({
  consentGivenAt,
  plan,
}: {
  consentGivenAt: string | null
  plan: string
}) {
  const formattedDate = consentGivenAt
    ? new Date(consentGivenAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-text-primary">Consent & data</h2>

      <div className="rounded-2xl bg-surface-subtle border border-border px-5 py-4 space-y-2">
        {formattedDate && (
          <p className="text-sm text-text-secondary">
            You gave parental consent on <strong>{formattedDate}</strong>.
          </p>
        )}
        <p className="text-sm text-text-secondary">
          Your data is stored in the EU. We never sell, share, or use it for advertising.
        </p>
        <Link href="/privacy" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
          Read our privacy policy →
        </Link>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-text-primary">Plan: <span className="capitalize">{plan}</span></p>
      </div>

      <div>
        <a
          href="/api/settings/export"
          download
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-surface-subtle transition-colors"
        >
          ⬇ Download my data
        </a>
        <p className="mt-1.5 text-xs text-text-muted">
          Downloads a JSON file with all your routines, profiles, and session history.
        </p>
      </div>
    </section>
  )
}

// ── Danger zone ──────────────────────────────────────────────

function DangerSection() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function deleteAccount() {
    if (confirmation !== 'DELETE') return
    setDeleting(true)
    setError('')

    const res = await fetch('/api/settings/delete-account', { method: 'DELETE' })

    if (res.ok) {
      // Sign out client-side and go to home
      const supabase = createClient()
      await supabase.auth.signOut()
      router.replace('/')
    } else {
      setDeleting(false)
      setError('Something went wrong. Please contact hello@heylulu.app.')
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-text-primary">Delete account</h2>

      {!open ? (
        <div className="space-y-2">
          <p className="text-sm text-text-secondary">
            Permanently delete your account, all child profiles, all routines, and all session history.
            This cannot be undone.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border-2 border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete my account
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 px-5 py-5 space-y-4">
          <p className="text-sm font-semibold text-red-700">
            This will permanently delete everything — profiles, routines, history. There is no undo.
          </p>
          <div className="space-y-1">
            <label className="text-xs font-medium text-red-700">
              Type <strong>DELETE</strong> to confirm
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={e => setConfirmation(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="DELETE"
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => { setOpen(false); setConfirmation(''); setError('') }}
              className="rounded-xl border-2 border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={deleteAccount}
              disabled={confirmation !== 'DELETE' || deleting}
              className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-40"
            >
              {deleting ? 'Deleting…' : 'Delete permanently'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function Divider() {
  return <hr className="border-border" />
}
