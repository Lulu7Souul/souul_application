'use client'

import { useState } from 'react'
import { EMOJI_BY_CATEGORY, EMOJI_CATEGORIES, getEmojiQuote } from '@/lib/emoji-library'

interface Props {
  selected: string[]            // exactly 5 emojis in order
  onChange: (emojis: string[]) => void
}

export function EmojiPicker({ selected, onChange }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('Animals')

  function toggle(emoji: string) {
    if (selected.includes(emoji)) {
      // Remove it
      onChange(selected.filter(e => e !== emoji))
    } else if (selected.length < 5) {
      // Add it
      onChange([...selected, emoji])
    }
    // If already 5 selected and not in list — do nothing (button is visually disabled)
  }

  function remove(index: number) {
    onChange(selected.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Chosen slots — always shown at top */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Your 5 rewards — in order
        </p>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const emoji = selected[i]
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-text-muted font-medium">{i + 1}</div>
                {emoji ? (
                  <button
                    onClick={() => remove(i)}
                    className="w-full aspect-square rounded-xl bg-brand-50 border-2 border-brand-300 flex items-center justify-center text-2xl hover:bg-red-50 hover:border-red-300 transition-colors group relative"
                    title={`Remove ${emoji}`}
                  >
                    <span className="group-hover:opacity-0 transition-opacity">{emoji}</span>
                    <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-red-400 text-sm">✕</span>
                  </button>
                ) : (
                  <div className="w-full aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center text-text-muted text-sm">
                    ?
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Quote preview for last selected */}
        {selected.length > 0 && (
          <p className="text-xs text-text-secondary italic text-center px-2">
            Lulu: "{getEmojiQuote(selected[selected.length - 1])}"
          </p>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {EMOJI_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-brand-500 text-white'
                : 'bg-surface-subtle text-text-secondary hover:bg-surface-raised'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="grid grid-cols-8 gap-1.5 max-h-52 overflow-y-auto">
        {(EMOJI_BY_CATEGORY[activeCategory] ?? []).map(({ emoji }) => {
          const isSelected  = selected.includes(emoji)
          const isMaxed     = selected.length >= 5 && !isSelected

          return (
            <button
              key={emoji}
              onClick={() => toggle(emoji)}
              disabled={isMaxed}
              className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-brand-100 ring-2 ring-brand-500 scale-110'
                  : isMaxed
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-surface-subtle hover:scale-105 active:scale-95'
              }`}
              title={getEmojiQuote(emoji)}
              aria-label={`${emoji}${isSelected ? ' (selected)' : ''}`}
            >
              {emoji}
            </button>
          )
        })}
      </div>

      {selected.length < 5 && (
        <p className="text-xs text-text-muted text-center">
          Choose {5 - selected.length} more
        </p>
      )}
      {selected.length === 5 && (
        <p className="text-xs text-brand-600 text-center font-medium">
          All 5 chosen! Tap any to remove and swap it.
        </p>
      )}
    </div>
  )
}
