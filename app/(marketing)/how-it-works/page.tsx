import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How it works',
  description: 'See how Lulu guides children through daily routines — from building your first sequence to your child following it step by step.',
}

const PARENT_STEPS = [
  {
    n: '1',
    title: 'Create a child profile',
    body: 'Give your child a name, pick their avatar emoji, and choose how Lulu speaks to them — Lulu\'s voice, your recorded voice, or visuals only. Set a 4-digit PIN so only you can enter and exit child mode.',
  },
  {
    n: '2',
    title: 'Choose their reward emojis',
    body: 'Pick 5 emojis from the library — animals, space, treats, nature, whatever your child loves. Each one unlocks after a completed routine. Complete 6 in a day and they earn the 👑 crown.',
  },
  {
    n: '3',
    title: 'Build or pick a routine',
    body: 'Browse 28 ready-made routines across morning, school, afternoon, and evening — or create your own from scratch. Each step can have a visual, voice cue, timer, and help message.',
  },
  {
    n: '4',
    title: 'Hand it to your child',
    body: 'Open Lulu, enter the PIN to start child mode, and tap the routine. Lulu takes it from there.',
  },
]

const CHILD_STEPS = [
  {
    icon: '📋',
    title: 'Today\'s routines',
    body: 'Your child sees a simple list of their routines for the day with their reward chart at the top. One tap to start.',
  },
  {
    icon: '➡️',
    title: 'One step at a time',
    body: 'A visual fills the screen. Lulu reads the step aloud. A timer runs if one is set. The child taps "Done" when they\'re ready.',
  },
  {
    icon: '✨',
    title: 'What\'s next notice',
    body: 'Before every new step, a gentle screen shows what\'s coming — so there are no surprises. The child taps "I\'m ready!" when they\'re prepared.',
  },
  {
    icon: '🌿',
    title: 'A break, if they need it',
    body: 'A "Break" button is always visible. Tap it and Lulu guides a short breathing exercise. Then back to the routine.',
  },
  {
    icon: '🎉',
    title: 'Celebrate every completion',
    body: 'Finish a routine and a celebration screen appears — with their new reward accessory and a warm message from Lulu.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-text-primary">How Lulu works</h1>
        <p className="text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
          You build the routine. Lulu delivers it — calmly, warmly, one step at a time.
        </p>
      </div>

      {/* For the parent */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-text-primary">For you — the parent or carer</h2>
        <div className="space-y-6">
          {PARENT_STEPS.map(s => (
            <div key={s.n} className="flex gap-5">
              <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 mt-0.5">
                {s.n}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-text-primary text-lg">{s.title}</h3>
                <p className="text-text-secondary leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* For the child */}
      <section className="bg-brand-50 rounded-3xl border border-brand-100 px-8 py-10 space-y-8">
        <h2 className="text-2xl font-bold text-text-primary">For your child</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CHILD_STEPS.map(s => (
            <div key={s.title} className="space-y-2">
              <span className="text-3xl">{s.icon}</span>
              <h3 className="font-bold text-text-primary">{s.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Insight */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-text-primary">And you stay informed</h2>
        <p className="text-text-secondary leading-relaxed max-w-2xl">
          The Insights page shows you which routines your child completes, where they ask for help,
          and how often they take breaks — without turning every day into a report card.
          The numbers are there to help you support them, not to judge.
        </p>
      </section>

      {/* CTA */}
      <div className="rounded-2xl bg-brand-500 px-8 py-10 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Ready to try it?</h2>
        <p className="text-brand-100">It takes under ten minutes to set up your first routine.</p>
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
