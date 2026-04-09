import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // RLS "Owners can manage team" ensures only the owner can delete
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', params.id)
    .eq('owner_id', user.id)

  if (error) return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })

  return new NextResponse(null, { status: 204 })
}
