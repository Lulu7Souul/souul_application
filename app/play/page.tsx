import type { Metadata } from 'next'
import { PlayEntryClient } from '@/components/player/PlayEntryClient'

export const metadata: Metadata = {
  title: 'Lulu',
}

// PIN entry page — child selects their profile and enters PIN
export default function PlayPage() {
  return <PlayEntryClient />
}
