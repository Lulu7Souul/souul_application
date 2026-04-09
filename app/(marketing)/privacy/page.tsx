import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Lulu\'s privacy policy — how we store, use, and protect your family\'s data. GDPR-K compliant, EU data residency, no third-party tracking.',
}

const LAST_UPDATED = '9 April 2026'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-text-primary">Privacy policy</h1>
        <p className="text-text-muted text-sm">Last updated: {LAST_UPDATED}</p>
        <p className="text-text-secondary leading-relaxed">
          Lulu is used by families with young children. We take that responsibility seriously.
          This policy explains — in plain language — what data we collect, why, how we store it,
          and what rights you have.
        </p>
      </div>

      <Section title="Who we are">
        <p>
          Lulu is operated by Souul Ltd. If you have any questions about this policy, contact us at{' '}
          <a href="mailto:hello@heylulu.app" className="text-brand-600 underline underline-offset-2">
            hello@heylulu.app
          </a>
          .
        </p>
      </Section>

      <Section title="What we collect">
        <p>We collect only what we need to run the service:</p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-text-secondary">
          <li>Your email address and password (to create and secure your account)</li>
          <li>Your child's name and avatar emoji (to personalise the experience)</li>
          <li>Routines and steps you create</li>
          <li>Session logs — which routines were completed, help taps, breaks taken</li>
          <li>Optional: visual images and voice recordings you upload for steps</li>
        </ul>
        <p className="mt-3">
          We do not collect your child's full name, date of birth, school, location, or any
          sensitive personal information. PINs are hashed and never stored in a readable form.
        </p>
      </Section>

      <Section title="Children's data">
        <p>
          Lulu is used by and for children. We apply GDPR-K — the European standard for
          children's personal data — as our global baseline.
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-text-secondary">
          <li>Parental consent is required before creating a child profile</li>
          <li>We collect the minimum data needed for the service to function</li>
          <li>No child data is used for advertising or profiling</li>
          <li>No child data is shared with third parties</li>
        </ul>
      </Section>

      <Section title="Where your data is stored">
        <p>
          All data is stored in the European Union (Frankfurt, Germany) via Supabase, our
          database provider. Data never leaves the EU. File uploads (images, voice recordings)
          are stored in the same EU infrastructure.
        </p>
      </Section>

      <Section title="Third-party services">
        <p>
          Lulu does not use any third-party advertising or tracking services. We use:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-text-secondary">
          <li><strong>Supabase</strong> — database, authentication, and file storage (EU)</li>
          <li><strong>Netlify</strong> — hosting and deployment</li>
          <li><strong>Plausible Analytics</strong> — privacy-first, cookieless page analytics on public pages only. No data is collected on child-facing screens (/play/*). No personal data is involved.</li>
          <li><strong>Resend</strong> — transactional email (account confirmation, password reset)</li>
        </ul>
        <p className="mt-3">That's it. No Facebook pixel. No Google Analytics. No advertising networks. Ever.</p>
      </Section>

      <Section title="How we use your data">
        <ul className="space-y-2 list-disc list-inside text-text-secondary">
          <li>To provide and improve the Lulu service</li>
          <li>To send account-related emails (confirmation, password reset)</li>
          <li>To show you insights about your child's routine activity</li>
        </ul>
        <p className="mt-3">We do not sell, rent, or share your data with anyone.</p>
      </Section>

      <Section title="Your rights">
        <p>Under GDPR, you have the right to:</p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-text-secondary">
          <li>Access all data we hold about you and your child</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and all associated data</li>
          <li>Export your data in a portable format</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, contact{' '}
          <a href="mailto:hello@heylulu.app" className="text-brand-600 underline underline-offset-2">
            hello@heylulu.app
          </a>
          . We will respond within 30 days.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Lulu uses a single session cookie to keep you logged in. No tracking cookies,
          no advertising cookies, no third-party cookies on authenticated pages.
          Plausible Analytics on public pages is cookieless.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If we make significant changes to this policy, we will notify you by email and
          update the date at the top of this page. Continued use of Lulu after changes
          take effect constitutes acceptance of the updated policy.
        </p>
      </Section>

      <div className="rounded-2xl bg-brand-50 border border-brand-100 px-6 py-5 text-sm text-brand-800 space-y-1">
        <p className="font-semibold">Questions about privacy?</p>
        <p>
          We're a small team and we read every message.{' '}
          <a href="mailto:hello@heylulu.app" className="underline underline-offset-2">
            hello@heylulu.app
          </a>
        </p>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-t border-border pt-8">
      <h2 className="text-xl font-bold text-text-primary">{title}</h2>
      <div className="text-text-secondary leading-relaxed space-y-3">{children}</div>
    </section>
  )
}
