import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Accessibility',
  description: 'Lulu is built accessibility-first. Large touch targets, symbols-only mode, voice options, calm design, and reduced motion — for every child, every way they work.',
}

const COMMITMENTS = [
  {
    icon: '👆',
    title: 'Large touch targets',
    body: 'Every button in the child player is at least 64px — well above the 44px minimum recommended for young children and anyone with motor differences.',
  },
  {
    icon: '🖼️',
    title: 'Symbols-only mode',
    body: 'Turn off all text in the child-facing screens. Lulu works entirely through visuals — photos, drawings, or symbols you upload — for pre-readers and non-readers alike.',
  },
  {
    icon: '🎙️',
    title: 'Voice, your way',
    body: 'Lulu\'s voice, your own recorded voice, or no voice at all. Children who find voice overwhelming can use Lulu in complete silence.',
  },
  {
    icon: '✨',
    title: 'Predictable transitions',
    body: 'A "what\'s next" screen appears before every step. No sudden changes. No surprises. The child prepares, then chooses when to move on.',
  },
  {
    icon: '🌿',
    title: 'Calm corner, always available',
    body: 'One tap to step away from any routine into a guided breathing exercise. A break is never more than a tap away.',
  },
  {
    icon: '🎨',
    title: 'Warm, low-stimulation design',
    body: 'Soft colours, clean layouts, no flashing, no pop-ups. Lulu is designed to support focus — not compete with it.',
  },
  {
    icon: '⏱️',
    title: 'Visual timers',
    body: 'Each step can have a countdown bar. The child sees time passing — not numbers, not text — so endings are never a shock.',
  },
  {
    icon: '♿',
    title: 'WCAG 2.1 AA target',
    body: 'We design to meet WCAG 2.1 AA across all public-facing and parent-facing pages, with AAA targets on child-facing screens.',
  },
]

export default function AccessibilityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-text-primary">Accessibility</h1>
        <p className="text-xl text-text-secondary max-w-xl leading-relaxed">
          Lulu was built with neurodivergent children at the centre — not bolted on at the end.
          Every feature is a deliberate accessibility decision.
        </p>
      </div>

      {/* Our commitments */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-text-primary">Our commitments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {COMMITMENTS.map(c => (
            <div key={c.title} className="space-y-2">
              <span className="text-3xl">{c.icon}</span>
              <h3 className="font-bold text-text-primary">{c.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ongoing work */}
      <section className="rounded-3xl bg-brand-50 border border-brand-100 px-8 py-8 space-y-4">
        <h2 className="text-2xl font-bold text-text-primary">This is ongoing work</h2>
        <p className="text-text-secondary leading-relaxed">
          Accessibility is not a checklist we complete and move on from. We review every feature
          against the lived experience of children and families — and we expect to keep learning.
        </p>
        <p className="text-text-secondary leading-relaxed">
          If you find something that doesn't work for your child, we want to know.
          Please reach out to{' '}
          <a href="mailto:hello@heylulu.app" className="text-brand-600 underline underline-offset-2">
            hello@heylulu.app
          </a>
          .
        </p>
      </section>

      {/* Reduced motion note */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-text-primary">Reduced motion</h2>
        <p className="text-text-secondary leading-relaxed">
          Lulu respects your device's reduced motion setting. Animations on celebration screens
          and the reward chart are simplified when reduced motion is preferred.
          You can also turn off motion entirely in the child's profile settings.
        </p>
      </section>

      <div className="text-sm text-text-muted space-y-1">
        <p>Have a question or concern about accessibility?</p>
        <a href="mailto:hello@heylulu.app" className="text-brand-600 hover:text-brand-700 font-medium">
          hello@heylulu.app
        </a>
      </div>
    </div>
  )
}
