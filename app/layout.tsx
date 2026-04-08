import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Lulu — A calm guide for your child\'s day',
    template: '%s | Lulu',
  },
  description:
    'Lulu helps neurodivergent children move through their day with confidence. Build gentle visual routines with voice and music cues — for home, school, and everywhere in between.',
  keywords: ['visual routine', 'neurodivergent children', 'calm guide', 'daily routine', 'ADHD', 'autism', 'caregiver', 'guided sequence'],
  openGraph: {
    title: 'Lulu — A calm guide for your child\'s day',
    description: 'Lulu helps neurodivergent children move through their day with confidence. Gentle routines, warm cues, happier transitions.',
    url: 'https://heylulu.app',
    siteName: 'Lulu',
    locale: 'en_GB',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  // No analytics on this root layout — Plausible is added per-surface, never on /play
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-surface text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
