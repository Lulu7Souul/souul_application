import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'For families',
  description: 'Lulu helps parents and carers build gentle daily routines that children can follow independently — making mornings, transitions, and bedtimes calmer for the whole family.',
}

const MOMENTS = [
  { icon: '🌅', time: 'Morning', body: 'Wake up, wash, dress, eat, leave — in the right order, every time. No negotiations.' },
  { icon: '🎒', time: 'School transitions', body: 'Getting in the car, arriving at school, coming home. The handoffs that can feel the hardest.' },
  { icon: '🌤', time: 'Afternoon', body: 'Coming home, calming down, homework, free time. A structure that makes evenings possible.' },
  { icon: '🌙', time: 'Bedtime', body: 'Dinner, bath, brush teeth, bed. Predictable steps, calm endings, everybody rests.' },
]

const FEATURES = [
  {
    icon: '🎙️',
    title: 'Your voice or Lulu\'s',
    body: 'Record yourself reading each step — or let Lulu\'s calm, clear voice do it. Your child hears someone they trust.',
  },
  {
    icon: '✨',
    title: 'Transition notice',
    body: 'Before every new step, a gentle "what\'s next" screen appears. Your child prepares, then taps "I\'m ready." No sudden changes.',
  },
  {
    icon: '🌿',
    title: 'A calm corner, built in',
    body: 'If your child needs a break, one tap takes them to a short breathing exercise. Then back to the routine.',
  },
  {
    icon: '⭐',
    title: 'Rewards that mean something',
    body: 'Your child picks their own reward emojis. They see them building up across the day — not points, not scores, just theirs.',
  },
  {
    icon: '👤',
    title: 'Multiple children',
    body: 'Each child has their own profile, voice, emojis, and routines. No mixing, no confusion.',
  },
  {
    icon: '📊',
    title: 'Gentle insights',
    body: 'See completion rates, where help is needed, and which routines go smoothly — so you can support better, not push harder.',
  },
]

export default function ForFamiliesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-text-primary">For families</h1>
        <p className="text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
          Lulu was built for parents who know their child needs more than a chart on the fridge.
          Something warm. Something reliable. Something that actually works.
        </p>
        <Link
          href="/signup"
          className="inline-block mt-4 rounded-xl bg-brand-500 px-8 py-4 font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          Get started free
        </Link>
      </div>

      {/* Daily moments */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-text-primary">Every part of the day</h2>
        <p className="text-text-secondary">
          Lulu has 28 ready-made routines covering the moments families tell us are the hardest.
          Use them as-is, or edit every single step to match your child.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOMENTS.map(m => (
            <div key={m.time} className="rounded-2xl bg-surface-raised border border-border px-6 py-5 flex gap-4 items-start">
              <span className="text-3xl flex-shrink-0">{m.icon}</span>
              <div>
                <p className="font-bold text-text-primary">{m.time}</p>
                <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">{m.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-text-primary">Everything your family needs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="space-y-2">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-bold text-text-primary">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who Lulu is for */}
      <section className="rounded-3xl bg-warm-50 border border-warm-200 px-8 py-10 space-y-4">
        <h2 className="text-2xl font-bold text-text-primary">Lulu is for every family</h2>
        <p className="text-text-secondary leading-relaxed">
          Lulu was designed with neurodivergent children in mind — children who thrive with
          predictability, visual support, and gentle pacing. But it works for any child who
          benefits from knowing what comes next.
        </p>
        <p className="text-text-secondary leading-relaxed">
          We don't label, diagnose, or categorise. We just help children move through their day
          with a little more confidence, and give parents a little more breathing room.
        </p>
      </section>

      {/* CTA */}
      <div className="rounded-2xl bg-brand-500 px-8 py-10 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Start with one routine</h2>
        <p className="text-brand-100 leading-relaxed">
          Pick Morning Routine, add your child's name, and see how it feels.
          You can always build from there.
        </p>
        <Link
          href="/signup"
          className="inline-block rounded-xl bg-white px-8 py-3 font-bold text-brand-600 hover:bg-brand-50 transition-colors"
        >
          Try Lulu free
        </Link>
      </div>
    </div>
  )
}
