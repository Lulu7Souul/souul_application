-- Migration 008: Allow NULL owner_id for system-owned templates
-- Date: 2026-04-12
-- Templates are not owned by any user — they are system-wide and readable
-- by all authenticated users. Dropping NOT NULL removes the fake-UUID workaround.
-- Parents always fork a copy; the original template stays unmodified with owner_id = NULL.

ALTER TABLE public.sequences
  ALTER COLUMN owner_id DROP NOT NULL;
