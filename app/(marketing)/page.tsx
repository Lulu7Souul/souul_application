import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lulu — A calm guide for your child\'s day',
  description: 'Lulu helps neurodivergent children move through their day with confidence. Build gentle visual routines with voice and music cues — for home, school, and everywhere in between.',
}

const FEATURES = [
  {
    icon: '📋',
    title: 'Build routines in minutes',
    body: 'Choose from 28 ready-made templates — morning, school, afternoon, evening — or build your own. Every step, shaped around your child.',
  },
  {
    icon: '🎙️',
    title: 'Lulu guides your child',
    body: 'A warm, calm voice reads each step aloud. Use Lulu\'s voice, record your own, or turn sound off and let the visuals do the work.',
  },
  {
    icon: '⭐',
    title: 'Small wins, big confidence',
    body: 'Your child picks 5 reward emojis. They unlock one after each routine — and earn the 👑 crown for six in a day. Effort always counts.',
  },
]

const HOW_IT_WORKS = [
  {
    n: '1',
    title: 'Set up a profile',
    body: 'Choose your child\'s avatar, preferred voice, and reward emojis. Takes two minutes.',
  },
  {
    n: '2',
    title: 'Pick or build a routine',
    body: 'Start from a Lulu template or create your own steps from scratch. You can always edit later.',
  },
  {
    n: '3',
    title: 'Hand it to your child',
    body: 'Lulu takes it from there — one step at a time, at their pace, with a "what\'s next" notice before every transition.',
  },
]

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 mb-8">
          🌟 Calm, predictable, yours
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[1.1] tracking-tight max-w-3xl mx-auto">
          Your child's day,{' '}
          <span className="text-brand-500">one gentle step</span>{' '}
          at a time
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
          Lulu guides children through daily routines with warm visuals, a calm voice, and gentle transitions —
          so every morning, school run, and bedtime feels a little easier.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-xl bg-brand-500 px-8 py-4 text-base font-semibold text-white hover:bg-brand-600 transition-colors shadow-sm"
          >
            Get started free
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-xl border-2 border-border px-8 py-4 text-base font-semibold text-text-primary hover:bg-surface-subtle transition-colors"
          >
            See how it works →
          </Link>
        </div>

        <p className="mt-4 text-sm text-text-muted">No credit card needed. Free to start.</p>
      </section>

      {/* ── Feature strip ────────────────────────────────── */}
      <section className="bg-surface-subtle border-y border-border py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(f => (
            <div key={f.title} className="space-y-3">
              <span className="text-4xl">{f.icon}</span>
              <h3 className="text-lg font-bold text-text-primary">{f.title}</h3>
              <p className="text-text-secondary leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary">Ready in three steps</h2>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">
            From first login to your child's first routine — it takes under ten minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map(s => (
            <div key={s.n} className="relative space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-lg">
                {s.n}
              </div>
              <h3 className="text-lg font-bold text-text-primary">{s.title}</h3>
              <p className="text-text-secondary leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Learn more about how Lulu works →
          </Link>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────── */}
      <section className="bg-brand-50 border-y border-brand-100 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Built for the people who care most
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-surface-raised border border-border p-8 space-y-4">
              <span className="text-4xl">🏠</span>
              <h3 className="text-xl font-bold text-text-primary">Parents at home</h3>
              <p className="text-text-secondary leading-relaxed">
                For morning chaos and evening battles. Lulu makes transitions predictable — and
                gives your child independence to follow steps without you standing over them.
              </p>
              <Link href="/for-families" className="inline-block text-sm font-semibold text-brand-600 hover:text-brand-700">
                For families →
              </Link>
            </div>

            <div className="rounded-2xl bg-surface-raised border border-border p-8 space-y-4">
              <span className="text-4xl">🎒</span>
              <h3 className="text-xl font-bold text-text-primary">Educators and carers</h3>
              <p className="text-text-secondary leading-relaxed">
                Visual routines for the classroom, the school run, and after-school care.
                Share routines with families so the same structure follows the child everywhere.
              </p>
              <Link href="/for-educators" className="inline-block text-sm font-semibold text-brand-600 hover:text-brand-700">
                For educators →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🔒', label: 'Data stored in the EU' },
            { icon: '🚫', label: 'No third-party tracking' },
            { icon: '♿', label: 'Accessibility first' },
            { icon: '💛', label: 'GDPR-K compliant' },
          ].map(t => (
            <div key={t.label} className="space-y-2">
              <span className="text-3xl">{t.icon}</span>
              <p className="text-sm font-medium text-text-secondary">{t.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="bg-brand-500 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to give your child a calmer day?
          </h2>
          <p className="text-brand-100 text-lg leading-relaxed">
            Start with Lulu's templates, customise them for your child, and see how
            a little predictability changes everything.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-xl bg-white px-10 py-4 text-base font-bold text-brand-600 hover:bg-brand-50 transition-colors shadow-sm"
          >
            Get started free
          </Link>
          <p className="text-brand-200 text-sm">Free to start. No card required.</p>
        </div>
      </section>
    </div>
  )
}
