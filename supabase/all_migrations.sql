-- Souul — Initial Database Schema
-- Migration: 001_initial_schema
-- Date: 2026-04-08
-- NOTE: All tables created first, then all RLS policies — avoids forward-reference errors.

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'family', 'educator')),
  consent_given_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  audio_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  motion_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  communication_mode TEXT NOT NULL DEFAULT 'symbols_only'
    CHECK (communication_mode IN ('symbols_only', 'symbols_words', 'words_only')),
  pin_hash TEXT NOT NULL,
  calm_sequence_id UUID,           -- FK added after sequences table (circular ref)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_profile_id UUID REFERENCES public.child_profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('routine', 'story', 'practice', 'calm')),
  is_template BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  completion_action TEXT NOT NULL DEFAULT 'celebrate'
    CHECK (completion_action IN ('celebrate', 'next_sequence', 'return_to_today')),
  reward_text TEXT,
  reward_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resolve circular ref: child_profiles.calm_sequence_id → sequences
ALTER TABLE public.child_profiles
  ADD CONSTRAINT child_profiles_calm_sequence_fk
  FOREIGN KEY (calm_sequence_id) REFERENCES public.sequences(id) ON DELETE SET NULL;

CREATE TABLE public.steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES public.sequences(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT,
  step_type TEXT NOT NULL DEFAULT 'standard'
    CHECK (step_type IN ('standard', 'first_then', 'choice', 'communication', 'calm_trigger')),
  visual_url TEXT,
  audio_url TEXT,
  cue_type TEXT CHECK (cue_type IN ('start', 'transition', 'pacing', 'calm', 'celebration')),
  duration_seconds INTEGER CHECK (duration_seconds > 0),
  help_text TEXT,
  communication_options JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sequence_id, order_index)
);

CREATE TABLE public.session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES public.sequences(id) ON DELETE CASCADE,
  child_profile_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  steps_skipped INTEGER[] NOT NULL DEFAULT '{}',
  help_tapped_count INTEGER NOT NULL DEFAULT 0,
  break_tapped_count INTEGER NOT NULL DEFAULT 0,
  time_extensions_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_email TEXT NOT NULL,
  member_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  permission TEXT NOT NULL DEFAULT 'view' CHECK (permission IN ('view', 'edit')),
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(owner_id, member_email)
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create user_profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on sequences
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sequences_updated_at
  BEFORE UPDATE ON public.sequences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY — enable on all tables
-- ============================================================

ALTER TABLE public.user_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequences       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steps           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES — all tables exist at this point, no forward refs
-- ============================================================

-- user_profiles
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- child_profiles
CREATE POLICY "Owners can manage child profiles"
  ON public.child_profiles FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Team members can view child profiles"
  ON public.child_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.owner_id = child_profiles.owner_id
        AND team_members.member_id = auth.uid()
        AND team_members.accepted_at IS NOT NULL
    )
  );

-- sequences
CREATE POLICY "Owners can manage sequences"
  ON public.sequences FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Team members can view sequences"
  ON public.sequences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.owner_id = sequences.owner_id
        AND team_members.member_id = auth.uid()
        AND team_members.accepted_at IS NOT NULL
    )
  );

CREATE POLICY "Team editors can update sequences"
  ON public.sequences FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.owner_id = sequences.owner_id
        AND team_members.member_id = auth.uid()
        AND team_members.permission = 'edit'
        AND team_members.accepted_at IS NOT NULL
    )
  );

CREATE POLICY "Templates are readable by all authenticated users"
  ON public.sequences FOR SELECT
  USING (is_template = TRUE AND auth.uid() IS NOT NULL);

-- steps
CREATE POLICY "Steps visible if sequence is visible"
  ON public.steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sequences
      WHERE sequences.id = steps.sequence_id
        AND (sequences.owner_id = auth.uid() OR sequences.is_template = TRUE)
    )
  );

CREATE POLICY "Owners can manage steps"
  ON public.steps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.sequences
      WHERE sequences.id = steps.sequence_id
        AND sequences.owner_id = auth.uid()
    )
  );

-- session_logs
CREATE POLICY "Owners can view session logs"
  ON public.session_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sequences
      WHERE sequences.id = session_logs.sequence_id
        AND sequences.owner_id = auth.uid()
    )
  );

CREATE POLICY "Session logs insertable from service role"
  ON public.session_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sequences
      WHERE sequences.id = session_logs.sequence_id
        AND sequences.owner_id = auth.uid()
    )
  );

-- team_members
CREATE POLICY "Owners can manage team"
  ON public.team_members FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Invitees can view their own invite"
  ON public.team_members FOR SELECT
  USING (auth.uid() = member_id OR member_email = (SELECT email FROM auth.users WHERE id = auth.uid()));
-- Migration 002: Add voice settings to child_profiles
-- Date: 2026-04-08

ALTER TABLE public.child_profiles
  ADD COLUMN IF NOT EXISTS voice_mode TEXT NOT NULL DEFAULT 'lulu'
    CHECK (voice_mode IN ('lulu', 'parent', 'off')),
  ADD COLUMN IF NOT EXISTS lulu_voice_uri TEXT;
-- Migration 003: Store chosen reward emojis on child profile
-- Date: 2026-04-08
-- 5 emojis chosen by parent at profile setup. Stored as JSONB array of strings.

ALTER TABLE public.child_profiles
  ADD COLUMN IF NOT EXISTS accessory_emojis JSONB NOT NULL
    DEFAULT '["⭐","🎀","✨","🌈","👑"]'::jsonb;
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
-- Migration 005: Add transition_notice to child_profiles
-- Date: 2026-04-09
-- When enabled, a brief "what's next" screen appears between steps
-- so the child can prepare before the next step begins.

ALTER TABLE public.child_profiles
  ADD COLUMN IF NOT EXISTS transition_notice BOOLEAN NOT NULL DEFAULT TRUE;
-- Migration 006: Allow invitees to accept their own pending invite
-- Date: 2026-04-10
-- The existing SELECT policy lets invitees view their invite.
-- This adds an UPDATE policy so the accept endpoint can set member_id + accepted_at.

CREATE POLICY "Invitees can accept their own invite"
  ON public.team_members FOR UPDATE
  USING (
    member_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND accepted_at IS NULL
  )
  WITH CHECK (
    member_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
-- Migration 007: Store consent_given_at on signup
-- Date: 2026-04-10
-- The signup form requires the GDPR-K consent checkbox before submission.
-- This updates the trigger so consent_given_at is recorded at account creation.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, consent_given_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
