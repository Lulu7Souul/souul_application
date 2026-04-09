import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { InviteAccept } from '@/components/team/InviteAccept'

interface Props {
  searchParams: { id?: string }
}

export default async function InvitePage({ searchParams }: Props) {
  const { id } = searchParams

  if (!id) {
    return <InviteShell><InvalidInvite /></InviteShell>
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in — ask them to sign in first
  if (!user) {
    const redirectTo = `/invite?id=${id}`
    return (
      <InviteShell>
        <div className="space-y-6 text-center">
          <p className="text-5xl">👋</p>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-text-primary">You've been invited to Lulu</h1>
            <p className="text-text-secondary leading-relaxed max-w-sm mx-auto">
              Sign in or create a free account to accept the invitation.
            </p>
          </div>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link
              href={`/signup?redirectTo=${encodeURIComponent(redirectTo)}`}
              className="rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600 transition-colors text-center"
            >
              Create a free account
            </Link>
            <Link
              href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
              className="rounded-xl border-2 border-border px-6 py-3 font-semibold text-text-primary hover:bg-surface-subtle transition-colors text-center"
            >
              Sign in
            </Link>
          </div>
        </div>
      </InviteShell>
    )
  }

  // Logged in — render the accept component
  return (
    <InviteShell>
      <InviteAccept inviteId={id} userEmail={user.email ?? ''} />
    </InviteShell>
  )
}

function InviteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">
        <Link href="/" className="block text-center text-xl font-bold text-brand-600">Lulu</Link>
        <div className="rounded-3xl bg-surface-raised border border-border px-8 py-10">
          {children}
        </div>
      </div>
    </div>
  )
}

function InvalidInvite() {
  return (
    <div className="text-center space-y-4">
      <p className="text-4xl">😔</p>
      <h1 className="text-xl font-bold text-text-primary">Invite link not found</h1>
      <p className="text-text-secondary text-sm">
        This invite link may have expired or already been used.
      </p>
      <Link href="/" className="inline-block text-sm text-brand-600 hover:text-brand-700 font-medium">
        Go to Lulu →
      </Link>
    </div>
  )
}
