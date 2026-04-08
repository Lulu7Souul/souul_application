import type { Accessory } from '@/lib/rewards'

interface Props {
  avatarEmoji: string
  accessories: Accessory[]   // only the unlocked ones
  size?: 'sm' | 'md' | 'lg'
}

const SIZE = {
  sm: { avatar: 'text-5xl', outer: 'w-20 h-20',  accessory: 'text-lg', crown: 'text-2xl', sparkle: 'text-base' },
  md: { avatar: 'text-7xl', outer: 'w-32 h-32',  accessory: 'text-2xl', crown: 'text-3xl', sparkle: 'text-lg'  },
  lg: { avatar: 'text-9xl', outer: 'w-48 h-48',  accessory: 'text-3xl', crown: 'text-5xl', sparkle: 'text-xl'  },
}

export function AvatarWithAccessories({ avatarEmoji, accessories, size = 'md' }: Props) {
  const s = SIZE[size]

  const hasCrown   = accessories.some(a => a.isCrown)
  const nonCrown   = accessories.filter(a => !a.isCrown)

  // Most recently earned non-crown accessory sits on top of the avatar
  const topItem    = nonCrown[nonCrown.length - 1] ?? null

  return (
    <div className={`relative ${s.outer} flex items-center justify-center select-none`}>

      {/* ── Crown mode: orbiting sparkles ring ── */}
      {hasCrown && (
        <>
          {/* Slow orbit ring of sparkles */}
          <div className="absolute inset-0 animate-spin-slow pointer-events-none">
            <span className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 ${s.sparkle}`}>✨</span>
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 ${s.sparkle}`}>✨</span>
            <span className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 ${s.sparkle}`}>✨</span>
            <span className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 ${s.sparkle}`}>✨</span>
          </div>
          {/* Counter-rotating sparkles for depth */}
          <div className="absolute inset-2 animate-spin-slow-reverse pointer-events-none" style={{ animationDuration: '12s' }}>
            <span className={`absolute top-0 left-1/2 -translate-x-1/2 ${s.sparkle} opacity-60`}>⭐</span>
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${s.sparkle} opacity-60`}>⭐</span>
          </div>
        </>
      )}

      {/* ── Avatar ── */}
      <span className={s.avatar}>{avatarEmoji}</span>

      {/* ── Crown sits above everything, centre top ── */}
      {hasCrown && (
        <span
          className={`absolute -top-5 left-1/2 -translate-x-1/2 ${s.crown} animate-bounce-once drop-shadow-lg`}
          style={{ filter: 'drop-shadow(0 0 8px gold)' }}
        >
          👑
        </span>
      )}

      {/* ── Most recent non-crown accessory — top right when crown is absent ── */}
      {topItem && !hasCrown && (
        <span className={`absolute -top-2 -right-2 ${s.accessory} animate-bounce-once`}>
          {topItem.emoji}
        </span>
      )}

      {/* ── When crown is present, show last non-crown at bottom right ── */}
      {topItem && hasCrown && (
        <span className={`absolute -bottom-2 -right-2 ${s.accessory}`}>
          {topItem.emoji}
        </span>
      )}
    </div>
  )
}
