# Souul — Final V1 Sitemap
> Status: LOCKED. Date: 2026-04-08.

---

## Public Layer — `souul.app/`

```
/                           Home
  ↳ Hero: one-line product statement + CTA (Start free)
  ↳ How it works: Author → Play → Review (3 steps)
  ↳ Who it's for: Families, educators, therapists
  ↳ Social proof / trust signals
  ↳ CTA: Start free

/how-it-works               Explainer
  ↳ The three surfaces
  ↳ What a Guided Sequence is
  ↳ Music/cue layer explained
  ↳ Demo video / walkthrough

/for-families               Family use cases
  ↳ Morning routines, transitions, calm-down, school prep

/for-educators              Educator/therapist use cases (V1 lite — inform, don't sell)
  ↳ Cross-context sharing, team roles coming in V2

/evidence                   Evidence & Approach
  ↳ Structured teaching / visual supports
  ↳ Social Stories framework
  ↳ UDL + cognitive accessibility
  ↳ What we claim vs what we don't claim

/accessibility              Accessibility statement
  ↳ WCAG 2.2 AA
  ↳ Cognitive accessibility commitments
  ↳ Co-design approach

/privacy                    Privacy & Safety
  ↳ What data we collect
  ↳ Child data protections (GDPR-K / UK AADC)
  ↳ Parental consent model
  ↳ Right to erasure
  ↳ No advertising, no tracking

/pricing                    Pricing
  ↳ Free tier: 1 child profile, 5 sequences
  ↳ Family plan: unlimited sequences, 3 profiles, team sharing
  ↳ Educator plan (V2)

/login                      Sign in
/signup                     Create account
/forgot-password            Reset password
```

---

## Adult Workspace — `souul.app/app/`

> Authenticated adults only. All routes redirect to /login if unauthenticated.

```
/app/dashboard              Home base
  ↳ Today's sequences (assigned to child profiles)
  ↳ Recent completions
  ↳ Friction alerts (sequences with high help/skip rates)
  ↳ Launch child mode button (PIN prompt)
  ↳ Quick link: + New sequence

/app/profiles               Child profiles list
/app/profiles/new           Create child profile
  ↳ Name, avatar (upload or emoji)
  ↳ Sensory preferences (audio on/off, motion on/off)
  ↳ Cue preferences (which cue types are active)
  ↳ Communication needs (symbols only / words + symbols / words only)
  ↳ Calm sequence assignment (which sequence runs on Break)
  ↳ PIN setup (4-digit child mode PIN)

/app/profiles/[id]          Edit child profile
/app/profiles/[id]/player   Preview child mode for this profile

/app/sequences              Sequence library
  ↳ Tabs: My Sequences | Templates | Archived
  ↳ Filter by type: All | Routine | Story | Practice | Calm
  ↳ Filter by profile
  ↳ Search

/app/sequences/new          Create new sequence
  ↳ Step 1: Choose type (Routine / Story / Practice / Calm)
  ↳ Step 2: Name the sequence + assign to profile
  ↳ Step 3: Add steps (see Sequence Builder below)
  ↳ Step 4: Set completion action + optional reward
  ↳ Step 5: Review + publish

/app/sequences/[id]         View/edit sequence
/app/sequences/[id]/builder Sequence builder (full editor)

  SEQUENCE BUILDER DETAIL:
  ├── Step list (drag to reorder)
  ├── Per step editor:
  │   ├── Step type: Standard | First-Then | Choice | Communication | Calm Trigger
  │   ├── Visual: upload image or video
  │   ├── Audio cue: record in browser or upload file
  │   ├── Cue type: start | transition | pacing | calm | celebration
  │   ├── Timer: duration in seconds (optional)
  │   ├── Help text: what child sees when they tap Help
  │   └── Communication options: add symbols/words (for communication step type)
  ├── Add step button
  └── Preview in child mode

/app/sequences/[id]/preview Preview sequence as child would see it

/app/insights               Insights overview
  ↳ Select profile + select sequence
  ↳ Metrics:
    - Completion rate (% of sessions completed)
    - Skipped steps (which steps get skipped most)
    - Help taps (which steps trigger most help requests)
    - Time extensions (where child needs more time)
  ↳ Last 7 sessions shown
  ↳ Adaptation suggestion (e.g. "Step 3 has 4 help taps — consider simplifying")

/app/team                   Team sharing
  ↳ Current members list
  ↳ Invite by email (one additional adult in V1)
  ↳ Set permission: View only | Can edit
  ↳ Remove member

/app/settings               Account settings
  ↳ Account: name, email, password change
  ↳ Consent: view consent record, update preferences
  ↳ Data export: download all data as JSON
  ↳ Delete account: full erasure request (30-day processing)
  ↳ Notifications: email preferences
  ↳ Subscription: plan details, manage billing
```

---

## Child Player — `souul.app/play/`

> PIN-gated. No adult UI. Full-screen. Launched from /app/dashboard.

```
/play                       PIN entry screen
  ↳ Child's name shown
  ↳ 4-digit PIN keypad (large targets)

/play/today                 Today's sequences
  ↳ Cards: sequence name + icon, large touch targets
  ↳ No text required to navigate (icon-first)

/play/[sequence-id]         Sequence player
  ↳ Step N of N indicator (subtle, top of screen)
  ↳ Step content: full-screen visual, auto-plays audio cue
  ↳ 4 action buttons (bottom, always visible):
    - DONE (primary, largest)
    - HELP
    - MORE TIME
    - BREAK

/play/[sequence-id]/help    Help screen (tapped from player)
  ↳ Shows help text set by adult
  ↳ Large text
  ↳ Back to step button

/play/calm                  Calm sequence player
  ↳ Auto-launched on Break
  ↳ Same player UI, calm-type sequence runs
  ↳ "Return to your routine" button on completion

/play/done                  Completion screen
  ↳ Celebration animation
  ↳ Optional reward image
  ↳ "Great job!" or custom completion message
  ↳ Back to Today button

/play/exit                  Exit child mode
  ↳ PIN required
  ↳ Returns to /app/dashboard
```

---

## Routes Summary

| Layer | Route prefix | Auth |
|---|---|---|
| Public | `/` | None |
| Adult workspace | `/app/*` | Adult account required |
| Child player | `/play/*` | PIN required (set by adult) |
| Auth | `/login`, `/signup`, `/forgot-password` | None |
