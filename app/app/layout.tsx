import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from '@/components/auth/LogoutButton'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-surface-raised shrink-0">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-border">
          <span className="text-xl font-bold text-brand-600">Lulu</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link href="/app/dashboard"  className="nav-item">🏠 Home</Link>
          <Link href="/app/sequences"  className="nav-item">📋 Routines</Link>
          <Link href="/app/profiles"   className="nav-item">👤 Profiles</Link>
          <Link href="/app/insights"   className="nav-item">📊 Insights</Link>
          <Link href="/app/team"       className="nav-item">👥 Team</Link>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border space-y-1">
          <Link href="/app/settings" className="nav-item">⚙️ Settings</Link>
          <div className="px-3 py-2 text-xs text-text-muted truncate">{firstName}</div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-border bg-surface-raised">
          <span className="text-lg font-bold text-brand-600">Lulu</span>
          <MobileNav />
        </div>
        {children}
      </main>
    </div>
  )
}

// Mobile nav — simple icon bar at top
function MobileNav() {
  return (
    <nav className="flex items-center gap-1">
      <Link href="/app/dashboard"  className="p-2 text-text-muted hover:text-text-primary">🏠</Link>
      <Link href="/app/sequences"  className="p-2 text-text-muted hover:text-text-primary">📋</Link>
      <Link href="/app/profiles"   className="p-2 text-text-muted hover:text-text-primary">👤</Link>
      <Link href="/app/insights"   className="p-2 text-text-muted hover:text-text-primary">📊</Link>
      <Link href="/app/settings"   className="p-2 text-text-muted hover:text-text-primary">⚙️</Link>
    </nav>
  )
}
