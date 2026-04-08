import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = { title: 'Sign in' }

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; message?: string }
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-surface">
      <div className="w-full max-w-sm space-y-8">
        {/* Lulu wordmark */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-600">Lulu</h1>
          <p className="mt-2 text-text-secondary text-sm">Welcome back</p>
        </div>

        {searchParams.message && (
          <div className="rounded-xl bg-calm-50 border border-calm-200 px-4 py-3 text-sm text-calm-700">
            {searchParams.message}
          </div>
        )}

        <LoginForm redirectTo={searchParams.redirectTo} />

        <p className="text-center text-sm text-text-muted">
          New to Lulu?{' '}
          <Link href="/signup" className="text-brand-600 font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
