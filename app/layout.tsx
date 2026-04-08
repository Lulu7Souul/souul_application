import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Souul — Guided routines for neurodivergent children',
    template: '%s | Souul',
  },
  description:
    'Build visual guided sequences that help neurodivergent children move through their day with confidence. Made for families, used at home, school, and therapy.',
  keywords: ['autism', 'ADHD', 'visual routine', 'neurodivergent', 'guided sequence', 'children', 'caregiver'],
  openGraph: {
    title: 'Souul — Guided routines for neurodivergent children',
    description: 'Build visual guided sequences that help neurodivergent children move through their day with confidence.',
    url: 'https://souul.app',
    siteName: 'Souul',
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
