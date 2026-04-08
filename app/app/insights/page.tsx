import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { InsightsClient } from '@/components/insights/InsightsClient'

export const metadata: Metadata = { title: 'Insights' }

export default async function InsightsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch last 90 days of session logs joined to sequence titles
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: logs }, { data: profiles }] = await Promise.all([
    supabase
      .from('session_logs')
      .select(`
        id,
        sequence_id,
        child_profile_id,
        started_at,
        completed_at,
        steps_skipped,
        help_tapped_count,
        break_tapped_count,
        time_extensions_count,
        sequences ( title )
      `)
      .gte('started_at', ninetyDaysAgo)
      .order('started_at', { ascending: false }),

    supabase
      .from('child_profiles')
      .select('id, name, avatar_url')
      .eq('owner_id', user.id)
      .order('created_at'),
  ])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <InsightsClient
        logs={logs ?? []}
        profiles={profiles ?? []}
      />
    </div>
  )
}
