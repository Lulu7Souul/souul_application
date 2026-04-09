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
