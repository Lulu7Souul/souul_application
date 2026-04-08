import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SequenceLibrary } from '@/components/sequences/SequenceLibrary'

export const metadata: Metadata = { title: 'Routines' }

export default async function SequencesPage({
  searchParams,
}: {
  searchParams: { tab?: string; onboarding?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Load user's own sequences
  const { data: mySequences } = await supabase
    .from('sequences')
    .select(`
      id, title, type, is_published, is_archived, updated_at,
      child_profiles ( name, avatar_url )
    `)
    .eq('owner_id', user.id)
    .eq('is_template', false)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })

  // Load all system templates
  const { data: templates } = await supabase
    .from('sequences')
    .select('id, title, type')
    .eq('is_template', true)
    .order('title')

  // Load child profiles for the "assign to child" dropdown
  const { data: profiles } = await supabase
    .from('child_profiles')
    .select('id, name, avatar_url')
    .eq('owner_id', user.id)
    .order('created_at')

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <SequenceLibrary
        mySequences={mySequences ?? []}
        templates={templates ?? []}
        profiles={profiles ?? []}
        initialTab={(searchParams.tab as 'mine' | 'templates') ?? 'mine'}
        isOnboarding={searchParams.onboarding === 'true'}
      />
    </div>
  )
}
