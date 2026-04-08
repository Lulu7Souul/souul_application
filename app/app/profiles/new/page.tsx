import type { Metadata } from 'next'
import { NewProfileForm } from '@/components/profiles/NewProfileForm'

export const metadata: Metadata = { title: 'Set up your child\'s profile' }

export default function NewProfilePage({
  searchParams,
}: {
  searchParams: { onboarding?: string }
}) {
  const isOnboarding = searchParams.onboarding === 'true'

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-8">
      {isOnboarding ? (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">
            Let's set up Lulu for your child
          </h1>
          <p className="text-text-secondary">
            This takes about two minutes. You can change everything later.
          </p>
        </div>
      ) : (
        <h1 className="text-2xl font-bold text-text-primary">Add a child profile</h1>
      )}

      <NewProfileForm isOnboarding={isOnboarding} />
    </div>
  )
}
