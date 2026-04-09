'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/how-it-works',  label: 'How it works' },
  { href: '/for-families',  label: 'For families' },
  { href: '/for-educators', label: 'For educators' },
  { href: '/pricing',       label: 'Pricing' },
]

export function MarketingNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-surface-raised/90 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Wordmark */}
        <Link href="/" className="text-xl font-bold text-brand-600 tracking-tight">
          Lulu
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            Get started free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-text-secondary hover:text-text-primary"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-surface-raised px-4 py-4 space-y-1">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-border mt-2">
            <Link href="/login" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-text-secondary">Sign in</Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white text-center hover:bg-brand-600"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
