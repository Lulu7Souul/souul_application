-- Migration 003: Store chosen reward emojis on child profile
-- Date: 2026-04-08
-- 5 emojis chosen by parent at profile setup. Stored as JSONB array of strings.

ALTER TABLE public.child_profiles
  ADD COLUMN IF NOT EXISTS accessory_emojis JSONB NOT NULL
    DEFAULT '["⭐","🎀","✨","🌈","👑"]'::jsonb;
