'use client'

import { useState, useMemo } from 'react'

interface SessionLog {
  id: string
  sequence_id: string
  child_profile_id: string
  started_at: string
  completed_at: string | null
  steps_skipped: number[]
  help_tapped_count: number
  break_tapped_count: number
  time_extensions_count: number
  sequences: { title: string } | null
}

interface ChildProfile {
  id: string
  name: string
  avatar_url: string
}

interface Props {
  logs: SessionLog[]
  profiles: ChildProfile[]
}

type TimeRange = '7d' | '30d' | '90d'

const RANGE_LABEL: Record<TimeRange, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
}

function pct(n: number, d: number) {
  if (d === 0) return 0
  return Math.round((n / d) * 100)
}

function avg(values: number[]) {
  if (values.length === 0) return 0
  return +(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
}

export function InsightsClient({ logs, profiles }: Props) {
  const [childId, setChildId] = useState<string>('all')
  const [range, setRange] = useState<TimeRange>('30d')

  // Filter by time range + child
  const filtered = useMemo(() => {
    const cutoff = new Date(
      Date.now() - (range === '7d' ? 7 : range === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000
    )
    return logs.filter(l => {
      const matchesChild = childId === 'all' || l.child_profile_id === childId
      const matchesRange = new Date(l.started_at) >= cutoff
      return matchesChild && matchesRange
    })
  }, [logs, childId, range])

  // Summary stats
  const stats = useMemo(() => {
    const total = filtered.length
    const completed = filtered.filter(l => l.completed_at !== null).length
    const helpTaps = filtered.map(l => l.help_tapped_count)
    const breaks = filtered.map(l => l.break_tapped_count)
    const extensions = filtered.map(l => l.time_extensions_count)
    const stepsSkipped = filtered.reduce((acc, l) => acc + (l.steps_skipped?.length ?? 0), 0)
    return {
      total,
      completed,
      completionRate: pct(completed, total),
      avgHelp: avg(helpTaps),
      avgBreaks: avg(breaks),
      avgExtensions: avg(extensions),
      stepsSkipped,
    }
  }, [filtered])

  // Per-routine breakdown
  const routineBreakdown = useMemo(() => {
    const map = new Map<string, {
      title: string
      sessions: number
      completed: number
      helpTotal: number
      breakTotal: number
    }>()

    for (const l of filtered) {
      const title = l.sequences?.title ?? 'Unknown routine'
      const existing = map.get(l.sequence_id)
      if (existing) {
        existing.sessions++
        if (l.completed_at) existing.completed++
        existing.helpTotal += l.help_tapped_count
        existing.breakTotal += l.break_tapped_count
      } else {
        map.set(l.sequence_id, {
          title,
          sessions: 1,
          completed: l.completed_at ? 1 : 0,
          helpTotal: l.help_tapped_count,
          breakTotal: l.break_tapped_count,
        })
      }
    }

    return Array.from(map.values())
      .sort((a, b) => b.sessions - a.sessions)
  }, [filtered])

  // Which routine needs most support
  const mostSupport = routineBreakdown.length > 0
    ? routineBreakdown.reduce((best, r) =>
        (r.helpTotal + r.breakTotal) > (best.helpTotal + best.breakTotal) ? r : best
      )
    : null

  const hasData = filtered.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-text-primary">Insights</h1>

      {/* Child selector */}
      {profiles.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setChildId('all')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              childId === 'all'
                ? 'bg-brand-500 text-white'
                : 'bg-surface-subtle text-text-secondary hover:bg-surface-raised'
            }`}
          >
            All children
          </button>
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => setChildId(p.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                childId === p.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-subtle text-text-secondary hover:bg-surface-raised'
              }`}
            >
              {p.avatar_url} {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Time range */}
      <div className="flex gap-1 bg-surface-subtle rounded-xl p-1 w-fit">
        {(['7d', '30d', '90d'] as TimeRange[]).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              range === r
                ? 'bg-surface-raised text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {RANGE_LABEL[r]}
          </button>
        ))}
      </div>

      {!hasData ? (
        <EmptyState />
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Routines done"
              value={stats.completed.toString()}
              sub={`of ${stats.total} started`}
              accent="brand"
            />
            <StatCard
              label="Completion rate"
              value={`${stats.completionRate}%`}
              sub={stats.completionRate >= 80 ? 'Going really well' : stats.completionRate >= 50 ? 'Good progress' : 'Keep going'}
              accent={stats.completionRate >= 80 ? 'calm' : 'warm'}
            />
            <StatCard
              label="Help taps per session"
              value={stats.avgHelp.toString()}
              sub="avg across all routines"
              accent="neutral"
            />
            <StatCard
              label="Breaks taken per session"
              value={stats.avgBreaks.toString()}
              sub="avg across all routines"
              accent="neutral"
            />
          </div>

          {/* Extra row if interesting */}
          {stats.stepsSkipped > 0 && (
            <div className="rounded-2xl bg-warm-50 border border-warm-200 px-5 py-4 flex items-center gap-4">
              <span className="text-2xl">⏭</span>
              <div>
                <p className="font-semibold text-warm-800">
                  {stats.stepsSkipped} step{stats.stepsSkipped === 1 ? '' : 's'} skipped this period
                </p>
                <p className="text-sm text-warm-600">
                  That's normal — some steps just need more time to feel comfortable.
                </p>
              </div>
            </div>
          )}

          {/* Needs most support callout */}
          {mostSupport && (mostSupport.helpTotal + mostSupport.breakTotal) > 0 && (
            <div className="rounded-2xl bg-brand-50 border border-brand-100 px-5 py-4 flex items-center gap-4">
              <span className="text-2xl">💛</span>
              <div>
                <p className="font-semibold text-brand-800">
                  <span className="italic">{mostSupport.title}</span> needs the most support
                </p>
                <p className="text-sm text-brand-600">
                  {mostSupport.helpTotal} help tap{mostSupport.helpTotal !== 1 ? 's' : ''} and {mostSupport.breakTotal} break{mostSupport.breakTotal !== 1 ? 's' : ''} — worth a look at the steps.
                </p>
              </div>
            </div>
          )}

          {/* Routine breakdown */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
              By routine
            </h2>
            {routineBreakdown.map(r => (
              <RoutineRow
                key={r.title}
                title={r.title}
                sessions={r.sessions}
                completed={r.completed}
                helpTotal={r.helpTotal}
                breakTotal={r.breakTotal}
                isMostSupport={
                  mostSupport?.title === r.title &&
                  (mostSupport.helpTotal + mostSupport.breakTotal) > 0
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────

function StatCard({
  label, value, sub, accent,
}: {
  label: string
  value: string
  sub: string
  accent: 'brand' | 'calm' | 'warm' | 'neutral'
}) {
  const accentClass = {
    brand: 'bg-brand-50 border-brand-100',
    calm: 'bg-calm-50 border-calm-100',
    warm: 'bg-warm-50 border-warm-100',
    neutral: 'bg-surface-raised border-border',
  }[accent]

  return (
    <div className={`rounded-2xl border px-4 py-4 space-y-1 ${accentClass}`}>
      <p className="text-xs font-medium text-text-muted uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary">{sub}</p>
    </div>
  )
}

function RoutineRow({
  title, sessions, completed, helpTotal, breakTotal, isMostSupport,
}: {
  title: string
  sessions: number
  completed: number
  helpTotal: number
  breakTotal: number
  isMostSupport: boolean
}) {
  const rate = pct(completed, sessions)

  return (
    <div className={`rounded-xl border px-4 py-4 space-y-3 ${
      isMostSupport ? 'bg-brand-50 border-brand-100' : 'bg-surface-raised border-border'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-text-primary leading-snug">{title}</p>
        <span className="text-xs text-text-muted whitespace-nowrap">{sessions} session{sessions !== 1 ? 's' : ''}</span>
      </div>

      {/* Completion bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-text-muted">
          <span>Completed</span>
          <span>{rate}%</span>
        </div>
        <div className="h-2 rounded-full bg-surface-subtle overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              rate >= 80 ? 'bg-calm-400' : rate >= 50 ? 'bg-brand-400' : 'bg-warm-400'
            }`}
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>

      {/* Support indicators */}
      {(helpTotal > 0 || breakTotal > 0) && (
        <div className="flex gap-4 text-xs text-text-muted">
          {helpTotal > 0 && <span>🙋 {helpTotal} help tap{helpTotal !== 1 ? 's' : ''}</span>}
          {breakTotal > 0 && <span>🌿 {breakTotal} break{breakTotal !== 1 ? 's' : ''}</span>}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center space-y-3">
      <p className="text-4xl">📊</p>
      <p className="font-semibold text-text-secondary">No sessions recorded yet</p>
      <p className="text-sm text-text-muted max-w-xs mx-auto">
        Once your child completes their first routine, you'll see their progress here.
      </p>
    </div>
  )
}
