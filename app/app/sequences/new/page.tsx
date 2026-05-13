import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Server action: create a blank sequence then send to the builder.
// Linked from the "+ New routine" button on the dashboard and the
// "+ Create new" button in the sequence library.
export default async function NewSequencePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Find the parent's first child profile to assign the sequence to.
  const { data: profiles } = await supabase
    .from('child_profiles')
    .select('id')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)

  // If no profile exists yet, send them to create one first.
  if (!profiles || profiles.length === 0) {
    redirect('/app/profiles/new?onboarding=true')
  }

  const { data: sequence, error } = await supabase
    .from('sequences')
    .insert({
      owner_id: user.id,
      child_profile_id: profiles[0].id,
      title: 'New routine',
      type: 'routine',
      is_published: false,
      is_archived: false,
      is_template: false,
      completion_action: 'celebrate',
    })
    .select('id')
    .single()

  if (error || !sequence) redirect('/app/sequences')

  redirect(`/app/sequences/${sequence.id}/builder`)
}
