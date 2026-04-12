-- Migration 011: Fix default accessory_emojis — crown replaced with star
-- Date: 2026-04-12
-- The crown (👑) is reserved as the permanent tier-6 reward and must never
-- appear in the choosable 5. Correct default is ["⭐","🎀","✨","🌈","🌟"].
-- Also backfills any existing profiles that received the wrong default.

ALTER TABLE public.child_profiles
  ALTER COLUMN accessory_emojis
    SET DEFAULT '["⭐","🎀","✨","🌈","🌟"]'::jsonb;

-- Backfill profiles that still have the wrong default
UPDATE public.child_profiles
  SET accessory_emojis = '["⭐","🎀","✨","🌈","🌟"]'::jsonb
  WHERE accessory_emojis = '["⭐","🎀","✨","🌈","👑"]'::jsonb;
