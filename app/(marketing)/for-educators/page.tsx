import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'For educators',
  description: 'Lulu supports educators and carers in building consistent, calming visual routines — in the classroom, at school, and shared with families at home.',
}

const USE_CASES = [
  {
    icon: '🏫',
    title: 'Classroom transitions',
    body: 'Arriving at school, pack-away time, lunchtime, home time. Predictable steps that every child in the room can follow.',
  },
  {
    icon: '🤝',
    title: 'Home-school continuity',
    body: 'Share the same routine across home and school so children experience consistency wherever they are.',
  },
  {
    icon: '🌿',
    title: 'Self-regulation moments',
    body: 'Lulu\'s calm corner guides a short breathing exercise whenever a child needs to step back and regroup.',
  },
  {
    icon: '🎒',
    title: 'Individual support plans',
    body: 'Build a routine around a specific child\'s needs — their visual, their voice, their pace.',
  },
]

export default function ForEducatorsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-text-primary">For educators</h1>
        <p className="text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
          Visual routines that travel with the child — from your classroom to their front door.
        </p>
      </div>

      {/* What educators use Lulu for */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-text-primary">Where Lulu fits your day</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {USE_CASES.map(u => (
            <div key={u.title} className="rounded-2xl bg-surface-raised border border-border px-6 py-5 space-y-2">
              <span className="text-3xl">{u.icon}</span>
              <h3 className="font-bold text-text-primary">{u.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{u.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team sharing */}
      <section className="rounded-3xl bg-brand-50 border border-brand-100 px-8 py-10 space-y-4">
        <h2 className="text-2xl font-bold text-text-primary">Team access — coming soon</h2>
        <p className="text-text-secondary leading-relaxed">
          We're building a team sharing feature so a teaching assistant, therapist, or parent can
          view and edit the same routines — keeping everyone consistent without a chain of emails.
        </p>
        <p className="text-text-secondary leading-relaxed">
          In the meantime, any parent or carer can create a Lulu account and share login access
          with a trusted adult at school.
        </p>
      </section>

      {/* How Lulu is designed for this */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-text-primary">Designed for neurodivergent learners</h2>
        <p className="text-text-secondary leading-relaxed">
          Every design decision in Lulu — the step-by-step layout, the large touch targets, the
          transition notice, the calm corner — was made with the needs of neurodivergent children
          in mind. Not as an add-on. As a foundation.
        </p>
        <p className="text-text-secondary leading-relaxed">
          Symbols-only mode removes all text from the child-facing screens. Timers show how long
          a step takes. Help text gives a gentle prompt without creating dependency.
        </p>
        <Link href="/accessibility" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Read our accessibility commitments →
        </Link>
      </section>

      {/* CTA */}
      <div className="rounded-2xl bg-brand-500 px-8 py-10 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Start with one child, one routine</h2>
        <p className="text-brand-100">
          Free to try. No commitments. Build your first routine in under ten minutes.
        </p>
        <Link
          href="/signup"
          className="inline-block rounded-xl bg-white px-8 py-3 font-bold text-brand-600 hover:bg-brand-50 transition-colors"
        >
          Get started free
        </Link>
      </div>
    </div>
  )
}
