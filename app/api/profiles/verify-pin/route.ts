import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { profileId, pin } = await request.json()

  if (!profileId || !pin || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  // Only allow verifying PINs for profiles the user owns
  const { data: profile } = await supabase
    .from('child_profiles')
    .select('pin_hash')
    .eq('id', profileId)
    .eq('owner_id', user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const valid = await bcrypt.compare(pin, profile.pin_hash)

  if (!valid) {
    // Consistent timing regardless of result — prevent timing attacks
    return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
