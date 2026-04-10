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
