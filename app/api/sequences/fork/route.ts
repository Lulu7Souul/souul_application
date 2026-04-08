import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Fork a template into the parent's own library.
// Creates a full copy of the sequence + all steps.
// The original template is never modified.
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { templateId, profileId } = await request.json()
  if (!templateId || !profileId) {
    return NextResponse.json({ error: 'Missing templateId or profileId' }, { status: 400 })
  }

  // Verify the profile belongs to this user
  const { data: profile } = await supabase
    .from('child_profiles')
    .select('id')
    .eq('id', profileId)
    .eq('owner_id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  // Fetch the template
  const { data: template } = await supabase
    .from('sequences')
    .select('title, type, completion_action, reward_text, reward_image_url')
    .eq('id', templateId)
    .eq('is_template', true)
    .single()

  if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

  // Create the forked sequence (owned by the parent, not a template)
  const { data: newSeq, error: seqError } = await supabase
    .from('sequences')
    .insert({
      owner_id: user.id,
      child_profile_id: profileId,
      title: template.title,
      type: template.type,
      is_template: false,
      is_published: false,   // parent must review and publish
      completion_action: template.completion_action,
      reward_text: template.reward_text,
      reward_image_url: template.reward_image_url,
    })
    .select('id')
    .single()

  if (seqError || !newSeq) {
    return NextResponse.json({ error: 'Failed to create sequence' }, { status: 500 })
  }

  // Fetch all template steps
  const { data: steps } = await supabase
    .from('steps')
    .select('order_index, title, step_type, visual_url, audio_url, cue_type, duration_seconds, help_text, communication_options')
    .eq('sequence_id', templateId)
    .order('order_index')

  // Copy steps to the new sequence
  if (steps && steps.length > 0) {
    const { error: stepsError } = await supabase
      .from('steps')
      .insert(
        steps.map(step => ({
          ...step,
          sequence_id: newSeq.id,
          // Do not copy visual_url or audio_url — parent uploads their own
          visual_url: null,
          audio_url: null,
        }))
      )

    if (stepsError) {
      // Rollback — delete the sequence we just created
      await supabase.from('sequences').delete().eq('id', newSeq.id)
      return NextResponse.json({ error: 'Failed to copy steps' }, { status: 500 })
    }
  }

  return NextResponse.json({ id: newSeq.id }, { status: 201 })
}
