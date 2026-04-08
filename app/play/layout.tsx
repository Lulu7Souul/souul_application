import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Souul',
  robots: {
    index: false,  // Child player pages are never indexed
    follow: false,
  },
}

// Child player layout — full screen, no adult chrome, no analytics
export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="player-full player-surface bg-surface">
      {children}
    </div>
  )
}
