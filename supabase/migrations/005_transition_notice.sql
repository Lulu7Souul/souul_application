-- Migration 005: Add transition_notice to child_profiles
-- Date: 2026-04-09
-- When enabled, a brief "what's next" screen appears between steps
-- so the child can prepare before the next step begins.

ALTER TABLE public.child_profiles
  ADD COLUMN IF NOT EXISTS transition_notice BOOLEAN NOT NULL DEFAULT TRUE;
