import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json()
  const { name, avatar_url, audio_enabled, motion_enabled, communication_mode,
          voice_mode, lulu_voice_uri, accessory_emojis, transition_notice, pin } = body

  if (!name || !pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  // Validate accessory_emojis — must be array of exactly 5 strings
  const emojis = Array.isArray(accessory_emojis) && accessory_emojis.length === 5
    ? accessory_emojis
    : ['⭐', '🎀', '✨', '🌈', '👑']

  const pin_hash = await bcrypt.hash(pin, 10)

  const { data, error } = await supabase
    .from('child_profiles')
    .insert({
      owner_id: user.id,
      name: name.trim(),
      avatar_url,
      audio_enabled: audio_enabled ?? true,
      motion_enabled: motion_enabled ?? true,
      communication_mode: communication_mode ?? 'symbols_only',
      voice_mode: voice_mode ?? 'lulu',
      lulu_voice_uri: lulu_voice_uri ?? null,
      accessory_emojis: emojis,
      transition_notice: transition_notice !== false,  // default true
      pin_hash,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Profile creation error:', error.message)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}
