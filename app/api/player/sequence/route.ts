import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Loads a full sequence with steps for the child player.
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  const profileId = request.nextUrl.searchParams.get('profileId')
  if (!id || !profileId) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  // Load sequence with steps — RLS ensures owner_id = user
  const { data: sequence } = await supabase
    .from('sequences')
    .select(`
      id, title, type, completion_action, reward_text, reward_image_url,
      steps (
        id, order_index, title, step_type,
        visual_url, audio_url, cue_type,
        duration_seconds, help_text, communication_options
      )
    `)
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (!sequence) return NextResponse.json({ error: 'Sequence not found' }, { status: 404 })

  // Sort steps
  const steps = [...(sequence.steps ?? [])].sort((a, b) => a.order_index - b.order_index)

  const { data: profile } = await supabase
    .from('child_profiles')
    .select('name, avatar_url, calm_sequence_id, voice_mode, lulu_voice_uri, accessory_emojis, transition_notice')
    .eq('id', profileId)
    .eq('owner_id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  return NextResponse.json({ sequence: { ...sequence, steps }, profile })
}
