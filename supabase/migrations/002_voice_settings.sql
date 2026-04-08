-- Migration 002: Add voice settings to child_profiles
-- Date: 2026-04-08

ALTER TABLE public.child_profiles
  ADD COLUMN IF NOT EXISTS voice_mode TEXT NOT NULL DEFAULT 'lulu'
    CHECK (voice_mode IN ('lulu', 'parent', 'off')),
  ADD COLUMN IF NOT EXISTS lulu_voice_uri TEXT;
