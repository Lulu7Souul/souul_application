-- Migration 004: Add template_group to sequences
-- Date: 2026-04-08
-- Groups: morning | activity | afternoon | evening

ALTER TABLE public.sequences
  ADD COLUMN IF NOT EXISTS template_group TEXT
    CHECK (template_group IN ('morning', 'activity', 'afternoon', 'evening'));

-- Index for fast group filtering on the library page
CREATE INDEX IF NOT EXISTS idx_sequences_template_group
  ON public.sequences (template_group)
  WHERE is_template = TRUE;
