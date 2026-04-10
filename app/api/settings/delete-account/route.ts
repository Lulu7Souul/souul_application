import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Permanently deletes the authenticated user's account and all associated data.
// Cascade deletes in migration 001 handle: user_profiles, child_profiles,
// sequences, steps, session_logs, team_members.
export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // Service role required to delete an auth user
  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { error } = await serviceClient.auth.admin.deleteUser(user.id)

  if (error) {
    console.error('Delete account error:', error.message)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
