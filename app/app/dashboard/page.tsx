import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Load child profiles
  const { data: profiles } = await supabase
    .from('child_profiles')
    .select('id, name, avatar_url')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })

  // First-time: no profiles yet — send to onboarding
  if (!profiles || profiles.length === 0) {
    redirect('/app/profiles/new?onboarding=true')
  }

  // Load today's published sequences for first profile
  const primaryProfile = profiles[0]
  const { data: sequences } = await supabase
    .from('sequences')
    .select('id, title, type, is_published')
    .eq('owner_id', user.id)
    .eq('child_profile_id', primaryProfile.id)
    .eq('is_published', true)
    .eq('is_archived', false)
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Good {getTimeOfDay()}, {user.user_metadata?.full_name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {primaryProfile.avatar_url} {primaryProfile.name}'s routines
          </p>
        </div>
        <Link
          href="/app/sequences/new"
          className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          + New routine
        </Link>
      </div>

      {/* Launch child mode */}
      <DashboardClient profileId={primaryProfile.id} profileName={primaryProfile.name} />

      {/* Today's sequences */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
          {primaryProfile.name}'s routines
        </h2>

        {!sequences || sequences.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center space-y-3">
            <p className="text-text-secondary">No routines yet.</p>
            <Link
              href="/app/sequences?onboarding=true"
              className="inline-block rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
            >
              Start from a template
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {sequences.map(seq => (
              <Link
                key={seq.id}
                href={`/app/sequences/${seq.id}`}
                className="flex items-center justify-between rounded-xl bg-surface-raised border border-border px-4 py-4 hover:bg-surface-subtle transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{typeEmoji(seq.type)}</span>
                  <span className="font-medium text-text-primary">{seq.title}</span>
                </div>
                <span className="text-xs text-text-muted capitalize">{seq.type}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function typeEmoji(type: string) {
  return { routine: '📋', story: '📖', practice: '✏️', calm: '🌿' }[type] ?? '📋'
}
