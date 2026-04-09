import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeamClient } from '@/components/team/TeamClient'

export const metadata: Metadata = { title: 'Team' }

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: members } = await supabase
    .from('team_members')
    .select('id, member_email, permission, invited_at, accepted_at')
    .eq('owner_id', user.id)
    .order('invited_at')

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <TeamClient members={members ?? []} />
    </div>
  )
}
