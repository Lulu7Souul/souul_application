import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Loads today's published sequences for a child profile.
// Called from the child player — needs auth (parent session still active).
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const profileId = request.nextUrl.searchParams.get('profileId')
  if (!profileId) return NextResponse.json({ error: 'Missing profileId' }, { status: 400 })

  // Verify profile belongs to this user
  const { data: profile } = await supabase
    .from('child_profiles')
    .select('id, name, avatar_url, accessory_emojis')
    .eq('id', profileId)
    .eq('owner_id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  // Load published, non-archived sequences for this profile
  const { data: sequences } = await supabase
    .from('sequences')
    .select('id, title, type')
    .eq('owner_id', user.id)
    .eq('child_profile_id', profileId)
    .eq('is_published', true)
    .eq('is_archived', false)
    .eq('is_template', false)
    .order('updated_at', { ascending: false })

  return NextResponse.json({ profile, sequences: sequences ?? [] })
}
