import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Lulu is free to start. Upgrade when you need more profiles, unlimited routines, and team sharing.',
}

const FREE_FEATURES = [
  '1 child profile',
  'All 28 Lulu template routines',
  'Up to 5 custom routines',
  'Lulu\'s voice, your voice, or no voice',
  'Reward emoji chart',
  'Transition notice',
  'Calm corner (breathing exercise)',
]

const FAMILY_FEATURES = [
  'Up to 3 child profiles',
  'Unlimited custom routines',
  'All templates',
  'Insights — completion, help, breaks',
  'Team sharing (1 additional adult)',
  'Priority support',
  'Everything in Free',
]

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-text-primary">Simple pricing</h1>
        <p className="text-xl text-text-secondary max-w-md mx-auto">
          Free to start. Upgrade when your family needs more.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free */}
        <div className="rounded-3xl border-2 border-border bg-surface-raised px-8 py-8 space-y-6">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Free</p>
            <p className="mt-1 text-4xl font-bold text-text-primary">£0</p>
            <p className="text-text-muted text-sm">forever</p>
          </div>

          <Link
            href="/signup"
            className="block w-full rounded-xl border-2 border-border px-4 py-3 text-center font-semibold text-text-primary hover:bg-surface-subtle transition-colors"
          >
            Get started
          </Link>

          <ul className="space-y-3">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-brand-500 mt-0.5 flex-shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Family */}
        <div className="rounded-3xl border-2 border-brand-500 bg-brand-50 px-8 py-8 space-y-6 relative">
          <div className="absolute -top-3 left-8">
            <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">
              Most popular
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Family</p>
            <div className="mt-1 flex items-end gap-2">
              <p className="text-4xl font-bold text-text-primary">Coming soon</p>
            </div>
            <p className="text-text-muted text-sm mt-1">pricing announced at launch</p>
          </div>

          <Link
            href="/signup"
            className="block w-full rounded-xl bg-brand-500 px-4 py-3 text-center font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            Start with Free
          </Link>

          <ul className="space-y-3">
            {FAMILY_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-brand-500 mt-0.5 flex-shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Educator */}
      <div className="rounded-3xl bg-surface-subtle border border-border px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="font-bold text-text-primary text-lg">For educators and schools</p>
          <p className="text-text-secondary text-sm max-w-md leading-relaxed">
            Class management, multiple profiles, home-school sharing, and team access.
            We're building this — get in touch to be first in line.
          </p>
        </div>
        <a
          href="mailto:hello@heylulu.app"
          className="flex-shrink-0 rounded-xl border-2 border-border px-6 py-3 font-semibold text-text-primary hover:bg-surface-raised transition-colors whitespace-nowrap"
        >
          Get in touch
        </a>
      </div>

      {/* FAQ */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-text-primary">Questions</h2>
        <div className="space-y-5">
          {[
            {
              q: 'Do I need a credit card to start?',
              a: 'No. The Free plan is free forever — no card, no trial, no surprises.',
            },
            {
              q: 'Can I try everything before deciding?',
              a: 'Yes. Start on Free, build routines, and see how it works for your family. Upgrade only when you need more.',
            },
            {
              q: 'Where is our data stored?',
              a: 'All data is stored in the EU (Frankfurt). We comply with GDPR-K — the highest standard for children\'s data protection. No data is ever sold or shared.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. No lock-in. Your data stays accessible on the Free plan even if you downgrade.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-border pb-5 space-y-2">
              <p className="font-semibold text-text-primary">{q}</p>
              <p className="text-text-secondary text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
