import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Souul',
}

// PIN entry page — child selects their profile and enters PIN
// In V1: simplified — one child profile per adult, PIN direct entry
export default function PlayPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-brand-600">Souul</h1>
        <p className="text-text-secondary text-lg">Ready for your routines?</p>
      </div>
      {/* PinEntry rendered client-side with profile data */}
      {/* TODO Phase 1: wire PinEntry component with Supabase child profile lookup */}
      <p className="text-text-muted text-sm">Loading your profile…</p>
    </div>
  )
}
