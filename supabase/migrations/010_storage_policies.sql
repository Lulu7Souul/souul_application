-- Migration 010: Storage bucket RLS policies for lulu-uploads
-- Date: 2026-04-12
-- Bucket created via API. Policies scoped to owner's own folder.
-- Upload path: {user_id}/{sequence_id}/{type}/{filename}

CREATE POLICY "Owners can upload to their own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'lulu-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Owners can read their own uploads"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'lulu-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Owners can delete their own uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'lulu-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
