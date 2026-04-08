import type { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = { title: 'Create your account' }

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-surface">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-600">Lulu</h1>
          <p className="mt-2 text-text-secondary text-sm">
            A calm guide for your child's day
          </p>
        </div>

        <SignupForm />

        <p className="text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-text-muted leading-relaxed">
          By creating an account you agree to our{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>
          {' '}and confirm you are the parent or guardian of any child whose data you add.
        </p>
      </div>
    </div>
  )
}
