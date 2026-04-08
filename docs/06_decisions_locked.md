# Locked Decisions — Crystallising Q&A
> Date: 2026-04-08. Answered by Visionary. Locked by PO.

---

## Q1 — Primary Caregiver Persona: PARENT AT HOME

**Impact:**
- Onboarding is template-first. Parent picks "Morning routine" and edits — they do not start from blank.
- Language is never clinical. Always warm, empathetic, human.
- Setup must deliver value in under 8 minutes.
- Marketing speaks to daily pain: mornings, transitions, meltdowns, bedtime.
- Educator/therapist features deferred entirely to V2.

---

## Q2 — Child Age Range: EARLY YEARS 3–7

**Impact — this is the biggest design change from the original brief:**
- Child player is **symbol/image only** by default. No reading required. Ever.
- Default `communication_mode` changes from `symbols_words` → `symbols_only`
- Touch targets upgrade: minimum 64px height on all child buttons (up from 44px)
- Sequences recommended max 5 steps in the builder (builder will warn above 5)
- Audio cues become MORE critical, not optional — at this age, voice/sound is the primary instruction medium
- Player aesthetic: bold, clear, warm. No small text. No dense UI.
- Celebration moments matter — this age group responds strongly to positive reinforcement
- Step visuals should fill the majority of the screen

---

## Q3 — Geography: GLOBAL FROM DAY ONE (GDPR-K as baseline)

**Impact:**
- Supabase project: EU data residency (Frankfurt region)
- No third-party tracking anywhere in the product. Ever.
- No cookies beyond session auth cookies
- Plausible analytics only on public marketing pages — never on /play
- Parental consent is explicit, recorded with timestamp, and required before any child data is created
- Right to erasure: 30-day processing, confirmed to user
- COPPA is covered by building to GDPR-K (stricter)
- Terms of Service and Privacy Policy must be written before launch

---

## Q4 — Audio Model: BOTH (Bundled library + user upload)

**Impact:**
- V1 ships with a **starter sound library** — 15 royalty-free sounds, CC0 licensed
- Sounds organised by cue type: Ready (start) / Moving on (transition) / Breathe (calm) / Well done (celebration)
- Bundled sounds live in `/public/sounds/` — no storage cost, fast load
- User uploads (voice recordings, custom audio) go to Supabase Storage
- Supported upload formats: MP3, M4A, WAV (max 10MB)
- Audio is step-bound, auto-plays on step load, never loops
- Can be disabled per child, per sequence, per step

---

## Q5 — Product Name: NOT CONFIRMED. TBD.

**Brand register confirmed by Visionary:**

> Soft, calm, gentle, reassuring, predictable, clear, positive with a bit of playful and memorable presence.
> Never overwhelming.
> Guide, not entertainer.
> Support, not stimulus.
> Structure, not distraction.
> Warm and affectionate.
> Feels like a companion, not a tool.
> A great, helpful guide for emotional intelligence and daily life activities — including routines, activities and music — to make the lives of kids and parents easier.

**In code:** All references use `[AppName]` placeholder until name is confirmed.
**Repo:** stays as `souul_application` until renamed.

See `07_naming_brief.md` for name directions.
