import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { SequenceBuilder } from '@/components/sequences/SequenceBuilder'

export const metadata: Metadata = { title: 'Edit routine' }

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: sequence } = await supabase
    .from('sequences')
    .select(`
      id, title, type, is_published, completion_action, reward_text,
      child_profile_id,
      steps (
        id, order_index, title, step_type, visual_url, audio_url,
        cue_type, duration_seconds, help_text
      )
    `)
    .eq('id', params.id)
    .eq('owner_id', user.id)   // RLS also enforces this — defence in depth
    .single()

  if (!sequence) notFound()

  // Sort steps by order_index
  const sortedSteps = [...(sequence.steps ?? [])].sort(
    (a, b) => a.order_index - b.order_index
  )

  const { data: profiles } = await supabase
    .from('child_profiles')
    .select('id, name, avatar_url')
    .eq('owner_id', user.id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <SequenceBuilder
        sequence={{ ...sequence, steps: sortedSteps }}
        profiles={profiles ?? []}
      />
    </div>
  )
}
