'use client'

interface ActionBarProps {
  onDone: () => void
  onHelp: () => void
  onMoreTime: () => void
  onBreak: () => void
  disabled?: boolean
}

// The 4 persistent actions every child has in every sequence step.
// These never disappear, never change position, never require reading.
export function ActionBar({
  onDone,
  onHelp,
  onMoreTime,
  onBreak,
  disabled = false,
}: ActionBarProps) {
  return (
    <div
      className="flex gap-3 p-4 pb-safe"
      role="toolbar"
      aria-label="Sequence actions"
    >
      {/* Done — primary, largest, always first */}
      <button
        onClick={onDone}
        disabled={disabled}
        className="player-btn-primary flex-[2]"
        aria-label="Done — move to next step"
      >
        ✓ Done
      </button>

      {/* Help */}
      <button
        onClick={onHelp}
        disabled={disabled}
        className="player-btn-help flex-1"
        aria-label="Help — show instructions"
      >
        Help
      </button>

      {/* More time */}
      <button
        onClick={onMoreTime}
        disabled={disabled}
        className="player-btn-secondary flex-1"
        aria-label="More time — reset the timer"
      >
        More time
      </button>

      {/* Break */}
      <button
        onClick={onBreak}
        disabled={disabled}
        className="player-btn-calm flex-1"
        aria-label="Break — take a calm break"
      >
        Break
      </button>
    </div>
  )
}
