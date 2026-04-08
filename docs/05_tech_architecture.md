# Souul — Technical Architecture
> Status: LOCKED by PO. Date: 2026-04-08.
> All decisions made proactively. Rationale included for each.

---

## Stack Decision

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Works natively with Netlify. Server components reduce client JS. File-based routing matches our sitemap exactly. |
| **Language** | TypeScript | Type safety across the whole codebase — critical when child data is involved. |
| **Styling** | Tailwind CSS | Rapid development, consistent spacing. Child player needs specific size constraints — Tailwind utility classes make this precise. |
| **Backend / DB** | Supabase | Postgres DB + Auth + File Storage + Row-Level Security in one platform. SOC 2 Type 2 compliant — required for child data. EU data residency available. Free tier generous enough for V1. |
| **Auth** | Supabase Auth | Built-in email/password. Easy to add magic link later. RLS policies protect child data per account. |
| **File Storage** | Supabase Storage | Stores uploaded images, videos, and audio cues. Pre-signed URLs, direct browser upload, 1GB free. |
| **Deployment** | Netlify | Configured for Next.js via @netlify/plugin-nextjs. Auto-deploy on push to main. |
| **Analytics** | Plausible (self-hosted or cloud) | No cookies, no personal data, GDPR compliant. Never on child player pages. |
| **Email** | Resend | Team invites, account notifications. Simple API, good deliverability. |

---

## Repository Structure

```
souul_application/
├── docs/                          # Product docs (blueprint, sitemap, architecture)
├── app/                           # Next.js App Router
│   ├── (public)/                  # Public marketing pages
│   │   ├── page.tsx               # / Home
│   │   ├── how-it-works/
│   │   ├── for-families/
│   │   ├── for-educators/
│   │   ├── evidence/
│   │   ├── accessibility/
│   │   ├── privacy/
│   │   └── pricing/
│   ├── (auth)/                    # Auth pages (no layout chrome)
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── app/                       # Adult workspace (authenticated)
│   │   ├── layout.tsx             # Adult nav + sidebar
│   │   ├── dashboard/
│   │   ├── profiles/
│   │   ├── sequences/
│   │   │   ├── page.tsx           # Library
│   │   │   ├── new/
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # View sequence
│   │   │       ├── builder/       # Full step editor
│   │   │       └── preview/       # Preview as child
│   │   ├── insights/
│   │   ├── team/
│   │   └── settings/
│   ├── play/                      # Child player (PIN-gated)
│   │   ├── layout.tsx             # Full-screen, no adult chrome
│   │   ├── page.tsx               # PIN entry
│   │   ├── today/
│   │   ├── [sequence-id]/
│   │   │   ├── page.tsx           # Step player
│   │   │   └── help/
│   │   ├── calm/
│   │   └── done/
│   ├── api/                       # API routes
│   │   ├── auth/
│   │   ├── sequences/
│   │   ├── profiles/
│   │   ├── insights/
│   │   └── team/
│   ├── layout.tsx                 # Root layout
│   └── globals.css
├── components/                    # Shared UI components
│   ├── ui/                        # Base components (button, card, input...)
│   ├── player/                    # Child player components
│   │   ├── StepCard.tsx
│   │   ├── ActionBar.tsx          # Done/Help/More time/Break
│   │   ├── CelebrationScreen.tsx
│   │   └── PinEntry.tsx
│   ├── builder/                   # Sequence builder components
│   │   ├── StepEditor.tsx
│   │   ├── StepList.tsx
│   │   ├── AudioUpload.tsx
│   │   └── VisualUpload.tsx
│   ├── dashboard/
│   └── insights/
├── lib/                           # Utilities and helpers
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client
│   │   └── middleware.ts          # Auth middleware
│   ├── types/                     # TypeScript types
│   │   ├── sequence.ts
│   │   ├── profile.ts
│   │   └── session.ts
│   └── utils/
├── public/                        # Static assets
│   ├── icons/
│   └── images/
├── supabase/
│   ├── migrations/                # Database schema migrations
│   └── seed.sql                   # Starter templates seed data
├── .env.local                     # Environment variables (never committed)
├── .env.example                   # Template (committed, no secrets)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Database Schema

### `profiles` table (adult accounts — managed by Supabase Auth)
Supabase Auth handles the `auth.users` table. We extend with:

```sql
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  plan TEXT DEFAULT 'free',   -- free | family | educator
  consent_given_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `child_profiles` table
```sql
CREATE TABLE public.child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  audio_enabled BOOLEAN DEFAULT TRUE,
  motion_enabled BOOLEAN DEFAULT TRUE,
  communication_mode TEXT DEFAULT 'symbols_words',  -- symbols_only | symbols_words | words_only
  pin TEXT NOT NULL,                                 -- 4-digit hashed PIN
  calm_sequence_id UUID,                             -- FK to sequences
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `sequences` table
```sql
CREATE TABLE public.sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  child_profile_id UUID REFERENCES public.child_profiles(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL,           -- routine | story | practice | calm
  is_template BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  completion_action TEXT DEFAULT 'celebrate',  -- celebrate | next_sequence | return_to_today
  reward_text TEXT,
  reward_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `steps` table
```sql
CREATE TABLE public.steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES public.sequences(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT,                   -- adult-facing label only
  step_type TEXT DEFAULT 'standard',  -- standard | first_then | choice | communication | calm_trigger
  visual_url TEXT,
  audio_url TEXT,
  cue_type TEXT,                -- start | transition | pacing | calm | celebration
  duration_seconds INTEGER,
  help_text TEXT,
  communication_options JSONB,  -- [{label, symbol_url}]
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `session_logs` table
```sql
CREATE TABLE public.session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES public.sequences(id),
  child_profile_id UUID REFERENCES public.child_profiles(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  steps_skipped INTEGER[] DEFAULT '{}',   -- array of step order_index values
  help_tapped_count INTEGER DEFAULT 0,
  break_tapped_count INTEGER DEFAULT 0,
  time_extensions_count INTEGER DEFAULT 0
);
```

### `team_members` table
```sql
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  member_email TEXT NOT NULL,
  member_id UUID REFERENCES auth.users(id),  -- null until they accept
  permission TEXT DEFAULT 'view',             -- view | edit
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);
```

### Row-Level Security (RLS)
All tables have RLS enabled. Core policy: users can only access their own data.

```sql
-- Example for sequences:
ALTER TABLE public.sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sequences" ON public.sequences
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Team members can view shared sequences" ON public.sequences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE owner_id = sequences.owner_id
      AND member_id = auth.uid()
    )
  );
```

---

## Environment Variables

```bash
# .env.example (template — no real values)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # server only, never exposed to client

# App
NEXT_PUBLIC_APP_URL=https://souul.app
NEXT_PUBLIC_PLAY_URL=https://souul.app/play

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=hello@souul.app

# Analytics (Plausible)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=souul.app
```

---

## Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/play/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

---

## Key Technical Constraints

1. **Child player pages (`/play/*`) must work offline after first load** — use service worker caching for sequences. If a child loses connection mid-sequence, they must not see an error.

2. **Audio must not autoplay until user gesture** — browser autoplay policies require a user interaction before audio plays. In child mode, the "Start" button counts as the gesture.

3. **No third-party scripts on `/play/*` routes** — no analytics, no error tracking, no chat widgets. Child player is a clean room.

4. **Images and audio are served via Supabase Storage with pre-signed URLs** — never expose storage bucket directly. URLs expire after 1 hour.

5. **File upload limits** — Images: 5MB max. Audio: 10MB max. Video: 50MB max. Enforced client-side and server-side.

6. **PIN is hashed** — Never store PINs in plaintext. Use bcrypt. Child PINs are not passwords and should not be treated as credentials — they are a mode-switch mechanism.

---

## Build Order (Development Phases)

### Phase 0 — Foundation (now)
- Next.js project setup
- Supabase project + schema migrations
- Auth (sign up, login, session)
- Environment config
- Netlify deploy pipeline

### Phase 1 — Core loop
- Child profile creation
- Sequence builder (basic: steps, visuals, publish)
- Child player (step display, Done/Help/More time/Break)
- Session logging

### Phase 2 — Full V1
- Audio cue upload + playback
- Starter templates (10)
- Insights panel
- Team sharing + invites
- Calm Corner trigger
- Marketing site (public pages)
- Consent + privacy settings

### Phase 3 — Polish + Launch
- Performance audit
- Accessibility audit (WCAG 2.2 AA + cognitive)
- Privacy audit (GDPR-K / UK AADC)
- Child player stress test (what happens when things go wrong)
- Beta with 5 families
