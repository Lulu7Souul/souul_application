import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Returns today's completed task count for a child profile.
// "Today" = since midnight in the server's UTC day (simple, privacy-safe).
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const profileId = request.nextUrl.searchParams.get('profileId')
  if (!profileId) return NextResponse.json({ error: 'Missing profileId' }, { status: 400 })

  // Verify ownership
  const { data: profile } = await supabase
    .from('child_profiles')
    .select('id, name, avatar_url')
    .eq('id', profileId)
    .eq('owner_id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Count completed sequences today (completed_at is not null = finished)
  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('session_logs')
    .select('id', { count: 'exact', head: true })
    .eq('child_profile_id', profileId)
    .not('completed_at', 'is', null)
    .gte('started_at', todayStart.toISOString())

  return NextResponse.json({ tasksCompleted: count ?? 0 })
}
