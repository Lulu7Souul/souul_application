import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Returns all user-owned data as a JSON download.
// RLS ensures the user only receives their own data.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const [
    { data: profile },
    { data: childProfiles },
    { data: sequences },
    { data: sessionLogs },
    { data: teamMembers },
  ] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('full_name, plan, consent_given_at, created_at')
      .eq('id', user.id)
      .single(),

    supabase
      .from('child_profiles')
      .select('id, name, avatar_url, communication_mode, voice_mode, transition_notice, created_at')
      .eq('owner_id', user.id),

    supabase
      .from('sequences')
      .select(`
        id, title, type, is_published, is_template, completion_action, reward_text,
        created_at, updated_at,
        steps ( order_index, title, step_type, cue_type, duration_seconds, help_text )
      `)
      .eq('owner_id', user.id)
      .eq('is_template', false),

    supabase
      .from('session_logs')
      .select('sequence_id, child_profile_id, started_at, completed_at, steps_skipped, help_tapped_count, break_tapped_count, time_extensions_count'),

    supabase
      .from('team_members')
      .select('member_email, permission, invited_at, accepted_at')
      .eq('owner_id', user.id),
  ])

  const exportData = {
    exported_at: new Date().toISOString(),
    account: {
      email: user.email,
      ...profile,
    },
    child_profiles: childProfiles ?? [],
    sequences: sequences ?? [],
    session_logs: sessionLogs ?? [],
    team_members: teamMembers ?? [],
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="lulu-data-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  })
}
