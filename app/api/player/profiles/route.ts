import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Returns child profiles owned by the logged-in parent.
// Used by the /play entry page to list profiles for PIN selection.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profiles } = await supabase
    .from('child_profiles')
    .select('id, name, avatar_url')
    .eq('owner_id', user.id)
    .order('created_at')

  return NextResponse.json({ profiles: profiles ?? [] })
}
