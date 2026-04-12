import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_IMAGE_MB = 5
const MAX_AUDIO_MB = 10
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-m4a', 'audio/ogg']

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const form = await request.formData()
  const file = form.get('file') as File | null
  const type = form.get('type') as 'visual' | 'audio' | null
  const sequenceId = form.get('sequenceId') as string | null

  if (!file || !type || !sequenceId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate file type
  const isImage = type === 'visual'
  const allowed = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_AUDIO_TYPES
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
  }

  // Validate file size
  const maxMB = isImage ? MAX_IMAGE_MB : MAX_AUDIO_MB
  if (file.size > maxMB * 1024 * 1024) {
    return NextResponse.json({ error: `File too large (max ${maxMB}MB)` }, { status: 400 })
  }

  // Verify sequence ownership before accepting upload
  const { data: sequence } = await supabase
    .from('sequences')
    .select('id')
    .eq('id', sequenceId)
    .eq('owner_id', user.id)
    .single()

  if (!sequence) return NextResponse.json({ error: 'Sequence not found' }, { status: 404 })

  // Build storage path — scoped to user + sequence, prevents cross-user access
  const ext = file.name.split('.').pop()
  const filename = `${Date.now()}.${ext}`
  const path = `${user.id}/${sequenceId}/${type}/${filename}`
  const bucket = 'lulu-uploads'

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Return a signed URL valid for 1 year (or use public bucket with RLS)
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return NextResponse.json({ url: publicUrl }, { status: 201 })
}
