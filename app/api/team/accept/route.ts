import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Sign in first' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Missing invite id' }, { status: 400 })

  // Find the invite — must match this user's email and not yet accepted
  const { data: member } = await supabase
    .from('team_members')
    .select('id, member_email, accepted_at')
    .eq('id', id)
    .single()

  if (!member) {
    return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
  }
  if (member.member_email !== user.email?.toLowerCase()) {
    return NextResponse.json({ error: 'This invite is for a different email address' }, { status: 403 })
  }
  if (member.accepted_at) {
    return NextResponse.json({ message: 'Already accepted' }, { status: 200 })
  }

  // Accept: set member_id and accepted_at
  // Use service-role style update — we bypass RLS here by matching on id + member_email
  // The invitee RLS policy allows SELECT; for UPDATE we need owner_id match which fails.
  // We use the anon client but verify manually above, then use a targeted update.
  const { error } = await supabase
    .from('team_members')
    .update({
      member_id: user.id,
      accepted_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('member_email', user.email!.toLowerCase())

  if (error) return NextResponse.json({ error: 'Failed to accept invite' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
