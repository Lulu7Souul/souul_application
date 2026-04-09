'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  inviteId: string
  userEmail: string
}

type State = 'idle' | 'accepting' | 'accepted' | 'error'

export function InviteAccept({ inviteId, userEmail }: Props) {
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function accept() {
    setState('accepting')
    const res = await fetch('/api/team/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: inviteId }),
    })

    if (res.ok) {
      setState('accepted')
    } else {
      const data = await res.json()
      setErrorMsg(data.error ?? 'Something went wrong.')
      setState('error')
    }
  }

  if (state === 'accepted') {
    return (
      <div className="text-center space-y-6">
        <p className="text-5xl">🎉</p>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">You're in!</h1>
          <p className="text-text-secondary leading-relaxed">
            You can now view and manage routines. Welcome to Lulu.
          </p>
        </div>
        <Link
          href="/app/dashboard"
          className="inline-block rounded-xl bg-brand-500 px-8 py-3 font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="text-center space-y-4">
        <p className="text-4xl">😔</p>
        <h1 className="text-xl font-bold text-text-primary">Couldn't accept invite</h1>
        <p className="text-text-secondary text-sm">{errorMsg}</p>
        <p className="text-xs text-text-muted">
          Signed in as <strong>{userEmail}</strong>.
          If this invite was sent to a different address, sign out and sign in with that account.
        </p>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6">
      <p className="text-5xl">👋</p>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-text-primary">You've been invited to Lulu</h1>
        <p className="text-text-secondary leading-relaxed">
          You'll be able to view and manage routines on Lulu — a calm guide for children's daily life.
        </p>
      </div>
      <p className="text-xs text-text-muted">
        Accepting as <strong>{userEmail}</strong>
      </p>
      <button
        onClick={accept}
        disabled={state === 'accepting'}
        className="w-full rounded-xl bg-brand-500 px-6 py-4 font-semibold text-white hover:bg-brand-600 transition-colors disabled:opacity-60 text-lg"
      >
        {state === 'accepting' ? 'Accepting…' : 'Accept invitation'}
      </button>
    </div>
  )
}
