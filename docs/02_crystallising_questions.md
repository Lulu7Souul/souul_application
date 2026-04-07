# Crystallising Questions — Pre-Blueprint
> Status: AWAITING VISIONARY ANSWERS
> Once answered, these lock the canonical blueprint. No code is written before this file is complete.

---

## Q1 — Who is the PRIMARY caregiver persona?
The brief mentions parents, carers, therapists, and educators. V1 cannot optimise for all four equally.

**Options:**
- A) **Parent at home** — emotional, time-poor, wants templates and fast setup
- B) **Special education teacher** — needs school-day routine management, class-level use
- C) **Speech/OT therapist** — needs precise clinical sequencing, reporting for sessions
- D) **All three equally** (this answer means we defer the question and build generically — not recommended)

> Your answer shapes: onboarding flow, template library, Team feature scope, and pricing model.

---

## Q2 — What age range of children is this built for first?
The player UX is completely different for a 4-year-old vs a 12-year-old.

**Options:**
- A) **Early years: 3–7** — symbol-heavy, near-zero reading, very large targets, maximum audio cue reliance
- B) **Primary school: 6–12** — some reading, more step complexity possible, choice boards more nuanced
- C) **Teen: 12–18** — different aesthetic, more autonomy, less "cute" visual language

> Your answer shapes: child player design language, step complexity, template content.

---

## Q3 — Geography first: UK, US, or global from day one?
This is not a branding question — it's a legal and compliance architecture question.

**Why it matters:**
- **US first** → COPPA compliance required (verifiable parental consent mechanism, FTC rules)
- **UK/EU first** → GDPR-K + UK Age Appropriate Design Code (ICO) required
- **Both** → we build the stricter of the two (GDPR-K) and it covers COPPA
- **Global from day one** → we build GDPR-K as baseline (recommended if unsure)

> Your answer shapes: database schema, consent flows, analytics architecture, Terms of Service.

---

## Q4 — What is the music/audio model for V1?
The brief says music is a differentiator but doesn't resolve the content question.

**Options:**
- A) **User-upload only** — caregivers record their own voice cues and upload their own audio. Zero licensing risk. But zero "out of the box" audio experience.
- B) **Platform ships with a small library of licensed royalty-free cues** — start, transition, calm, celebration sounds. Licensing cost but immediate value.
- C) **Both** — a small bundled library + user upload. Recommended but requires licensing budget.

> Your answer shapes: storage architecture, licensing requirements, onboarding experience.

---

## Q5 — Is "Souul" the product name, and what is the brand register?
The repo is named `souul_application`. Before we write a single public-facing word, we need to confirm:

- Is **Souul** the final name?
- What is the emotional register? (calm/warm/clinical/playful?)
- Is there a logo or visual identity started?

> Your answer shapes: public layer copy, design system tokens, domain setup on Netlify.

---

## When you answer these, the following gets produced immediately:
- `03_canonical_blueprint.md` — locked product definition
- `04_v1_scope.md` — exact feature list with acceptance criteria
- `05_sitemap_final.md` — canonical sitemap, no ambiguity
- `06_tech_architecture.md` — full stack decision with rationale
- `07_design_system.md` — design tokens, component principles, child player spec
