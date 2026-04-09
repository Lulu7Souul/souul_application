import Link from 'next/link'

const LINKS = {
  Product: [
    { href: '/how-it-works',  label: 'How it works' },
    { href: '/for-families',  label: 'For families' },
    { href: '/for-educators', label: 'For educators' },
    { href: '/pricing',       label: 'Pricing' },
  ],
  Support: [
    { href: '/accessibility', label: 'Accessibility' },
    { href: '/privacy',       label: 'Privacy' },
    { href: '/signup',        label: 'Get started' },
    { href: '/login',         label: 'Sign in' },
  ],
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface-raised mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-2 space-y-3">
          <p className="text-xl font-bold text-brand-600">Lulu</p>
          <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
            A calm guide for neurodivergent children and the families who love them.
            Warm. Steady. Yours.
          </p>
          <p className="text-xs text-text-muted">
            Data stored securely in the EU. No third-party tracking. Ever.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([group, links]) => (
          <div key={group} className="space-y-3">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{group}</p>
            <ul className="space-y-2">
              {links.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} Lulu. All rights reserved.</p>
          <p>Made with care for children and families everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
