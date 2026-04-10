import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsClient } from '@/components/settings/SettingsClient'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, plan, consent_given_at')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <SettingsClient
        email={user.email ?? ''}
        fullName={profile?.full_name ?? ''}
        consentGivenAt={profile?.consent_given_at ?? null}
        plan={profile?.plan ?? 'free'}
      />
    </div>
  )
}
