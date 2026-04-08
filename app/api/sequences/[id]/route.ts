import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH /api/sequences/[id] — save sequence + steps in one request
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json()
  const { title, child_profile_id, reward_text, is_published, steps } = body

  // Verify ownership
  const { data: existing } = await supabase
    .from('sequences')
    .select('id')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single()

  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Update the sequence record
  const { error: seqError } = await supabase
    .from('sequences')
    .update({ title, child_profile_id, reward_text, is_published, updated_at: new Date().toISOString() })
    .eq('id', params.id)

  if (seqError) return NextResponse.json({ error: seqError.message }, { status: 500 })

  // Replace all steps — delete existing, insert new set
  // This is simpler and safer than diffing individual step changes
  await supabase.from('steps').delete().eq('sequence_id', params.id)

  if (steps && steps.length > 0) {
    const { error: stepsError } = await supabase.from('steps').insert(
      steps.map((step: Record<string, unknown>, i: number) => ({
        sequence_id: params.id,
        order_index: i + 1,
        title: step.title || null,
        step_type: step.step_type ?? 'standard',
        visual_url: step.visual_url ?? null,
        audio_url: step.audio_url ?? null,
        cue_type: step.cue_type ?? null,
        duration_seconds: step.duration_seconds ?? null,
        help_text: step.help_text || null,
        communication_options: step.communication_options ?? null,
      }))
    )
    if (stepsError) return NextResponse.json({ error: stepsError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// DELETE /api/sequences/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { error } = await supabase
    .from('sequences')
    .delete()
    .eq('id', params.id)
    .eq('owner_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
