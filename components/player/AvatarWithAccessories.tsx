import type { Accessory } from '@/lib/rewards'

interface Props {
  avatarEmoji: string
  accessories: Accessory[]
  size?: 'sm' | 'md' | 'lg'
}

const SIZE = {
  sm: { avatar: 'text-5xl', outer: 'w-20 h-20', accessory: 'text-xl' },
  md: { avatar: 'text-7xl', outer: 'w-32 h-32', accessory: 'text-2xl' },
  lg: { avatar: 'text-9xl', outer: 'w-44 h-44', accessory: 'text-3xl' },
}

// Renders the child's avatar emoji with stacked accessories positioned around it.
// Accessories animate in when newly earned.
export function AvatarWithAccessories({
  avatarEmoji,
  accessories,
  size = 'md',
}: Props) {
  const s = SIZE[size]
  const crown     = accessories.find(a => a.id === 'crown')
  const rainbow   = accessories.find(a => a.id === 'rainbow')
  const bow       = accessories.find(a => a.id === 'bow')
  const star      = accessories.find(a => a.id === 'star')
  const sparkles  = accessories.find(a => a.id === 'sparkles')

  // Priority: crown > rainbow > bow for the "top" slot
  const topItem = crown ?? rainbow ?? bow

  return (
    <div className={`relative ${s.outer} flex items-center justify-center select-none`}>
      {/* Sparkles ring — behind avatar */}
      {sparkles && (
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow pointer-events-none">
          <span className={`absolute -top-2 left-1/2 -translate-x-1/2 ${s.accessory}`}>✨</span>
          <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${s.accessory}`}>✨</span>
          <span className={`absolute top-1/2 -left-2 -translate-y-1/2 ${s.accessory}`}>✨</span>
          <span className={`absolute top-1/2 -right-2 -translate-y-1/2 ${s.accessory}`}>✨</span>
        </div>
      )}

      {/* Avatar */}
      <span className={s.avatar}>{avatarEmoji}</span>

      {/* Top accessory (crown / rainbow / bow) */}
      {topItem && (
        <span
          className={`absolute -top-4 left-1/2 -translate-x-1/2 ${s.accessory} animate-bounce-once`}
        >
          {topItem.emoji}
        </span>
      )}

      {/* Star — top right */}
      {star && !crown && (
        <span
          className={`absolute -top-1 -right-1 ${s.accessory} animate-bounce-once`}
        >
          {star.emoji}
        </span>
      )}
    </div>
  )
}
