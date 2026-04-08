# Souul — Canonical Blueprint V1
> Status: LOCKED by PO. Date: 2026-04-08.
> Visionary crystallising questions answered by PO as default decisions. All overridable.

---

## Product Statement

**Souul** is a web-first guided-sequence platform for neurodivergent children and their caregivers.

Adults build structured visual routines with optional music and voice cues. Children play them one step at a time on any device. Teams share sequences across home, school, and therapy.

It reduces repeated adult prompting and supports participation, transitions, independence, and co-regulation — without diagnosis labels, dark patterns, or surveillance.

---

## PO Default Decisions (Overridable by Visionary)

| Question | PO Decision | Rationale |
|---|---|---|
| Primary persona | **Parent at home** | Largest market, most emotional pain point, fastest to validate. Educator/therapist features defer to V2. |
| Child age range | **Primary school: 5–12** | Broadest V1 market. Player UI is symbol + word hybrid. Covers early readers and non-readers. |
| Geography | **UK first, GDPR-K compliant** | Stricter than COPPA — if we build to GDPR-K we are globally compliant. UK Age Appropriate Design Code is the gold standard. |
| Music/audio | **User-upload only in V1** | Zero licensing risk. Caregivers record their own voice. V2 adds a licensed sound library. |
| Product name | **Souul** | Confirmed by repo name. Brand register: warm, calm, human. Not clinical. Not childish. |

---

## North Star

> Reduce the number of times a caregiver has to repeat a prompt — and increase the number of moments a child moves through their day with confidence.

**Success metrics for V1:**
- A caregiver can build their first sequence in under 8 minutes from sign-up
- A child can complete a 5-step sequence with zero adult intervention
- A sequence can be shared with one other adult in under 60 seconds

---

## Core Object: Guided Sequence

Everything in Souul is a **Guided Sequence**. One object. Many use cases.

```
Guided Sequence
├── id
├── type: routine | story | practice | calm
├── title
├── child_profile_id
├── steps[]
│   ├── order
│   ├── title (optional — for adult reference)
│   ├── visual (image or video upload)
│   ├── audio_cue (voice/music upload, optional)
│   ├── cue_type: start | transition | pacing | calm | celebration
│   ├── duration_seconds (optional timer)
│   ├── step_type: standard | first_then | choice | communication | calm_trigger
│   ├── help_path (text shown when child taps Help)
│   └── communication_options[] (symbols/words shown on step)
├── completion_action: celebrate | next_sequence | return_to_today
├── reward (optional text/image)
├── is_published
└── session_logs[]
    ├── started_at
    ├── completed_at
    ├── steps_skipped[]
    ├── help_tapped_count
    ├── break_tapped_count
    └── time_extensions_count
```

---

## Three Surfaces

### 1. Author Surface — Adult Workspace
Where caregivers build, manage, and review sequences.
URL: `souul.app/app`
Access: Authenticated adults only. PIN-protected exit to child mode.

### 2. Player Surface — Child Mode
Where children run sequences. One step per screen. Zero adult UI visible.
URL: `souul.app/play`
Access: Launched from adult dashboard via PIN-gated switch. No independent login for child.

### 3. Review Surface — Insights Panel
Where adults review session data and adapt sequences.
Lives inside adult workspace at `/app/insights`.

---

## Three Pillars + Decision Rule

| Pillar | Meaning | If a feature doesn't serve this... |
|---|---|---|
| **Predictability** | Visual order, timers, first-then, what comes next | Cut it |
| **Expression** | Audio cues, voice prompts, choice boards, communication supports | Cut it |
| **Coordination** | Shared sequences, team roles, cross-context consistency | Cut it |

---

## V1 Feature Set

### Must ship in V1

| Feature | Surface | Notes |
|---|---|---|
| Email sign-up / login | Both | Supabase Auth |
| Child profile creation | Author | Name, avatar, sensory prefs, cue on/off |
| Sequence builder | Author | All 4 types: routine, story, practice, calm |
| Step editor | Author | Visual + audio upload, step type, timer, help text |
| Sequence library | Author | My sequences, templates (10 starter templates), archived |
| Child player | Player | One step per screen, Done/Help/More time/Break |
| Calm trigger | Player | Break → auto-launches assigned calm sequence |
| Basic insights | Author | Completion rate, skipped steps, help taps, avg time |
| Team sharing | Author | Invite one adult, view or edit permission |
| Consent & settings | Author | Data export, delete account, privacy controls |
| Public marketing site | Public | Home, How it works, Pricing, Privacy, Sign up |

### 10 Starter Templates (ships with V1)

1. Morning routine
2. Getting dressed
3. Brushing teeth
4. Leaving the house
5. School goodbye
6. Coming home from school
7. Homework time
8. Dinner time
9. Bedtime routine
10. Calm-down sequence

---

## Child Mode — Interaction Model

- Launched from adult dashboard → PIN entry (4-digit, set by adult)
- Full-screen, no browser chrome visible
- One step per screen always
- Step loads: visual fills screen, audio cue plays automatically if set
- 4 persistent buttons at bottom: **Done** | **Help** | **More time** | **Break**
- **Done** → advances to next step
- **Help** → shows help text set by adult (large text, stays on screen)
- **More time** → resets timer, logs a time extension
- **Break** → launches assigned calm sequence, returns to current step after
- Completion → celebration screen (confetti + optional reward image)
- Exit child mode → PIN required

---

## Privacy & Compliance (UK GDPR-K / Age Appropriate Design Code)

These are not features — they are architectural requirements baked in from day one:

1. **No child data used for advertising or profiling** — ever
2. **Data minimisation** — collect only what is needed to run sequences
3. **Parental consent** — adult creates account, explicitly consents on behalf of child
4. **Right to erasure** — delete account removes all data within 30 days
5. **No third-party tracking pixels** — no GA, no Meta pixel, no Hotjar on child-accessible pages
6. **Session data is functional only** — insights are for caregiver adaptation, not external reporting
7. **Geolocation not collected**
8. **No behavioural advertising**

Analytics on public pages: privacy-first only (e.g. Plausible or Fathom — no cookies).

---

## Music & Audio Model (V1)

- Audio is **user-uploaded only** — voice recordings, custom sounds
- Supported formats: MP3, M4A, WAV (max 10MB per file)
- Audio is **step-bound** — plays at start of step, does not loop
- Cue types: start / transition / pacing / calm / celebration
- Audio can be disabled: per child profile, per sequence, or per step
- No bundled music library in V1 (avoids licensing complexity)
- V2: licensed royalty-free sound library

---

## Brand Register

**Name:** Souul
**Tone:** Warm, calm, confident. Never clinical. Never childish.
**Palette direction:** Soft, accessible contrast. No harsh primaries. Think: warm neutrals + one calm accent.
**Typography:** Highly readable. Large defaults. Child mode uses even larger type.
**Imagery:** Real families, real children, real moments — not stock illustrations of "happy autism."

---

## What Souul Is Not

- Not an AAC system (we support AAC users, we are not a replacement)
- Not a therapy platform (we support therapeutic goals, we make no clinical claims)
- Not an autism app (neuroinclusive — ADHD, autism, sensory, executive function, and more)
- Not a music app (music is a cue layer, not the product)
- Not a surveillance tool (insights are for caregiver adaptation only)
