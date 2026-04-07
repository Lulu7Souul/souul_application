# PO Adversarial Audit — Souul V1 Brief
> Conducted by: Claude (Product Owner). Date: 2026-04-08.
> Method: Hostile-constructive review against the brief's own self-audit lens + competitive reality.

---

## Scores (Pre-Crystallisation)

| Dimension | Score | Note |
|---|---|---|
| Focus | 6/10 | Core object is strong; module count is too high |
| Clarity | 7/10 | Pillars and guardrails are clear; surfaces blur at edges |
| Accessibility | 7/10 | Guardrails are right; cognitive accessibility under-specified |
| Evidence fit | 8/10 | Frameworks are correct; music evidence caveat is honest |
| Differentiation | 6/10 | Music layer is real but fragile without better UX expression |
| Implementation realism | 5/10 | Module count and feature surface is too wide for V1 |
| Child safety/privacy readiness | 5/10 | Named but not scoped — COPPA/GDPR-K need architecture decisions now |

---

## A. Core Weaknesses

### 1. Module count is V2, not V1
The proposed adult workspace has 9 named modules: Dashboard, Profiles, Sequences, Sequence Builder, Cue Studio, Story Builder, Choice & Communication, Calm Corner, Insights + Team + Settings.
That is a full product. V1 should be 6 surfaces maximum.

### 2. Cue Studio is scope creep
Cue Studio implies a standalone audio-production interface. Caregivers are not audio producers. Cue management belongs inside the Sequence Builder as a step-level attachment — not a separate module with its own nav item.

### 3. Story Builder duplicates Sequence Builder
A Social Story is a Guided Sequence of type "story." Maintaining two builders means two interfaces to learn, two codebases to maintain, and a broken mental model. Merge Story Builder into Sequence Builder as a sequence type template.

### 4. Choice & Communication as a top-level module is wrong
First-then boards and choice boards are step-level components inside a sequence — not standalone tools. Surfacing them as a separate module implies children can access them outside a sequence context, which contradicts the "player" model. They belong as step types inside the builder.

### 5. Calm Corner needs to be clarified as a behaviour, not a module
"Calm Corner" in the adult workspace = a calm sequence type (handled by Sequence Builder).
"Calm Corner" in child mode = an emergency exit trigger that launches a pre-set calm sequence.
These are two different things. As a module it is undefined. As a behaviour it makes sense.

### 6. Web-first + child player = unresolved session model
How does a child enter child mode? This is the most critical UX question the brief does not answer. Options:
- PIN-protected mode switch on the same device
- Separate URL/subdomain (e.g. play.souul.app)
- QR code that opens child mode on a tablet
This decision affects the entire information architecture and authentication model.

### 7. Privacy is named but not architected
COPPA (US) and GDPR-K (UK/EU) require: verifiable parental consent, data minimization, no behavioural advertising, right to erasure. These are not features — they are constraints that shape the database schema, auth model, and analytics from day one. If geography is US or UK, this needs to be decided before any code is written.

### 8. Insights "version comparison" is V3
Version comparison requires storing full historical copies of sequences and diffing them over time. This is a significant engineering surface. Cut entirely from V1. V1 insights = 4 metrics: completion rate, skipped steps, help requests, time patterns.

### 9. Team "approvals" is enterprise, not V1
Approval workflows imply a formal review process between roles (therapist approves parent-created sequence). This is a school/clinic enterprise feature. V1 team = invite one additional adult, assign view or edit permission. That's it.

---

## B. Hidden Assumptions

1. **Assumes caregivers have 10+ minutes to author sequences.** Real caregivers (especially SEN parents and busy teachers) may have 3 minutes. The authoring flow must have a "quick start from template" path as the primary onboarding.

2. **Assumes music files are copyright-free or user-generated.** If the platform ships with music, licensing is a legal requirement. If user-generated only, this must be explicit in the UX and Terms.

3. **Assumes one device per session.** A parent may author on a laptop; the child plays on a shared tablet. The session model must handle this without friction.

4. **Assumes the child interacts alone.** Many neurodivergent children interact with support — the child player must not break when an adult is co-facilitating.

5. **Assumes web performance on low-end devices.** Target users may use older tablets or slow connections. Performance budget must be set before build.

---

## C. What to Cut Now (from V1)

| Cut | Reason |
|---|---|
| Cue Studio as standalone module | Merge into Sequence Builder as step-level audio attachment |
| Story Builder as standalone module | Merge into Sequence Builder as "Story" sequence type |
| Choice & Communication as standalone module | Make these step types inside builder |
| Insights: version comparison | V3 feature, significant engineering cost |
| Team: approvals | Enterprise feature |
| Team: version history | Dependent on version comparison, cut with it |
| Calm Corner as adult module | It is a sequence type, not a module |

---

## D. What to Defer to Phase 2

| Feature | Why Defer |
|---|---|
| Multiple child profiles per account | V1 should prove value with one child first |
| Cue intensity/length controls | Over-engineering before user research on audio UX |
| Educator/therapist role (separate from parent) | Role complexity adds auth and permission surface; prove parent use case first |
| Return-to-task flows from Calm Corner | Requires sequence chaining logic |
| Insights: time-of-day patterns | Requires sustained usage data to be meaningful |
| Goal tracking per profile | Depends on therapist integration, defer |

---

## E. Revised Canonical Product Statement

> Souul is a web-first guided-sequence platform for neurodivergent children and their caregivers.
> Adults author structured visual sequences with optional music/rhyme cues. Children play them one step at a time.
> The platform reduces repeated adult prompting and supports participation, transitions, and co-regulation — at home, school, and therapy.

---

## F. Revised V1 Sitemap

### Public Layer
- `/` Home (trust-building, one CTA: Start free)
- `/how-it-works` (3 surfaces explained: Author → Play → Review)
- `/for-families`
- `/for-educators`
- `/evidence` (framework references, not therapy claims)
- `/accessibility`
- `/privacy`
- `/pricing`
- `/login` + `/signup`

### Adult Workspace (`/app`)
- `/app/dashboard` — Today's sequences, recent completions, friction alerts, launch child mode
- `/app/profiles` — Add/edit child profile (name, avatar, sensory prefs, cue prefs, communication needs)
- `/app/sequences` — Library (My sequences, Templates, Archived)
- `/app/sequences/new` — **Unified Sequence Builder**
  - Choose type: Routine / Story / Practice / Calm
  - Add steps → per step: title, image/video, voice prompt, music cue (upload or record), timer, help path
  - Step type options: standard step / first-then / choice / communication card / calm trigger
  - Add completion state + optional reward
  - Assign to profile → publish
- `/app/insights` — Completion rate, skipped steps, help requests, avg time per step (per sequence, per child)
- `/app/team` — Invite one adult, assign view/edit role
- `/app/settings` — Account, consent management, data export, delete account, notification prefs

### Child Player (`/play` or subdomain `play.souul.app`)
- PIN-gated entry from adult dashboard
- Today's sequences list (large touch targets, icon-first)
- Sequence player:
  - One step per screen
  - Step content (image + optional audio cue auto-plays)
  - 4 persistent actions: Done / Help / More time / Break
  - Break → calm sequence auto-launches
  - Completion → celebration state
- No navigation, no settings, no adult surfaces visible

---

## G. Top 5 Differentiation Opportunities

1. **Music/rhyme as structural cue** — No competitor uses audio as a step-level pacing tool. This is real if executed as "the step starts when the cue plays" rather than background music.
2. **Zero-setup child mode** — If a caregiver can launch child mode in under 30 seconds from dashboard, that beats every competitor's friction.
3. **Cross-context coordination** — Home + school sharing a sequence library. No current product does this well for non-specialist families.
4. **Neuroinclusive framing (not diagnosis-led)** — Positioning around structure and participation rather than autism opens a wider, less stigmatised market.
5. **Template library as onboarding** — If V1 ships with 20 high-quality templates (morning routine, getting dressed, school goodbye, calm-down), caregivers get value in minutes, not after hours of authoring.

---

## H. Top 5 Risks

1. **Authoring burden kills retention.** If setup takes >10 minutes for first sequence, caregivers churn. Templates are not optional — they are survival.
2. **Privacy/compliance debt.** Building without COPPA/GDPR-K architecture creates refactoring debt or legal exposure. Decide geography now.
3. **Music licensing.** Any bundled audio creates IP liability. User-upload-only is safe but limits the "out of the box" experience. Must be decided before build.
4. **Child mode session fragility.** If the child player breaks, loses state, or accidentally exits, it causes a real distress event for the child. The player must be the most robust, tested surface in the product.
5. **Platform confusion.** If "Souul" is positioned too broadly (autism + ADHD + general family routines), marketing becomes incoherent. Primary persona must be chosen before launch positioning.

---

## I. PO Decision: What Happens Next

Before the blueprint is locked, 5 crystallising questions must be answered by the Visionary.
See `02_crystallising_questions.md`.
