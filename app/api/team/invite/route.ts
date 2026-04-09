import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'hello@heylulu.app'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://heylulu.app'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json()
  const { memberEmail, permission } = body

  if (!memberEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }
  if (!['view', 'edit'].includes(permission)) {
    return NextResponse.json({ error: 'Invalid permission' }, { status: 400 })
  }
  if (memberEmail.toLowerCase() === user.email?.toLowerCase()) {
    return NextResponse.json({ error: 'You cannot invite yourself' }, { status: 400 })
  }

  // Look up owner's name for the email
  const { data: ownerProfile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const ownerName = ownerProfile?.full_name?.split(' ')[0] ?? 'Someone'

  // Insert team member (unique constraint on owner_id + member_email handles duplicates)
  const { data: member, error } = await supabase
    .from('team_members')
    .insert({
      owner_id: user.id,
      member_email: memberEmail.toLowerCase(),
      permission,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'This person has already been invited' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 })
  }

  const inviteUrl = `${APP_URL}/invite?id=${member.id}`
  const permissionLabel = permission === 'edit' ? 'view and edit' : 'view'

  // Send invite email
  await resend.emails.send({
    from: `Lulu <${FROM}>`,
    to: [memberEmail],
    subject: `${ownerName} has invited you to help manage routines on Lulu`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1c1917;">
        <p style="font-size: 24px; font-weight: bold; color: #35926f; margin: 0 0 24px;">Lulu</p>

        <h1 style="font-size: 22px; font-weight: bold; margin: 0 0 12px;">You've been invited</h1>
        <p style="color: #57534e; margin: 0 0 16px; line-height: 1.6;">
          ${ownerName} has invited you to help manage their child's routines on Lulu —
          a calm guide that helps children move through their day with confidence.
        </p>
        <p style="color: #57534e; margin: 0 0 24px; line-height: 1.6;">
          You'll be able to <strong>${permissionLabel}</strong> their routines.
        </p>

        <a href="${inviteUrl}"
          style="display: inline-block; background: #35926f; color: white; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 16px; text-decoration: none;">
          Accept invitation
        </a>

        <p style="color: #a8a29e; font-size: 13px; margin: 24px 0 0; line-height: 1.6;">
          Don't have a Lulu account? You can create one for free when you click the link above.
          <br>If you weren't expecting this, you can ignore this email.
        </p>
      </div>
    `,
  })

  return NextResponse.json({ id: member.id }, { status: 201 })
}
