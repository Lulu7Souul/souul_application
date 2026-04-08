import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json()
  const {
    sequenceId,
    profileId,
    completedAt,
    stepsSkipped,
    helpTappedCount,
    breakTappedCount,
    timeExtensionsCount,
  } = body

  // Verify the sequence belongs to this user before logging
  const { data: sequence } = await supabase
    .from('sequences')
    .select('id')
    .eq('id', sequenceId)
    .eq('owner_id', user.id)
    .single()

  if (!sequence) return NextResponse.json({ error: 'Sequence not found' }, { status: 404 })

  const { error } = await supabase.from('session_logs').insert({
    sequence_id: sequenceId,
    child_profile_id: profileId,
    completed_at: completedAt ?? null,
    steps_skipped: stepsSkipped ?? [],
    help_tapped_count: helpTappedCount ?? 0,
    break_tapped_count: breakTappedCount ?? 0,
    time_extensions_count: timeExtensionsCount ?? 0,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true }, { status: 201 })
}
