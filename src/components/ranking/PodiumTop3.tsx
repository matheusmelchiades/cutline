import { cn } from '@/lib/cn'
import { formatPoints } from '@/lib/format'
import type { MockRankedSurfer } from '@/types/mock'

interface PodiumTop3Props {
  top3: MockRankedSurfer[]
}

const MEDALS = ['\u{1F947}', '\u{1F948}', '\u{1F949}'] as const
const BORDER_COLORS = ['border-gold', 'border-silver', 'border-bronze'] as const

function PodiumItem({
  ranked,
  isCenter,
}: {
  ranked: MockRankedSurfer
  isCenter: boolean
}) {
  const idx = ranked.rank - 1
  const initials = ranked.surfer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2',
        isCenter ? 'order-1 -mt-4' : ranked.rank === 2 ? 'order-0' : 'order-2'
      )}
    >
      {/* Medal */}
      <span className="text-2xl">{MEDALS[idx]}</span>

      {/* Avatar */}
      <div
        className={cn(
          'flex items-center justify-center rounded-full border-2 bg-surface-input font-bold text-text-2',
          BORDER_COLORS[idx],
          isCenter ? 'h-20 w-20 text-xl' : 'h-16 w-16 text-base'
        )}
      >
        {initials}
      </div>

      {/* Name */}
      <p
        className={cn(
          'max-w-[100px] truncate text-center font-semibold text-text-1',
          isCenter ? 'text-[15px]' : 'text-[13px]'
        )}
      >
        {ranked.surfer.name}
      </p>

      {/* Country */}
      <p className="text-[13px] text-text-2">
        {ranked.surfer.countryFlag}
      </p>

      {/* Points */}
      <p
        className={cn(
          'font-semibold tabular-nums text-brand-400',
          isCenter ? 'text-lg' : 'text-base'
        )}
      >
        {formatPoints(ranked.totalPoints)}
      </p>
    </div>
  )
}

export function PodiumTop3({ top3 }: PodiumTop3Props) {
  if (top3.length < 3) return null

  return (
    <div
      className="flex items-end justify-center gap-6 rounded-lg px-4 py-6"
      style={{ background: 'var(--gradient-podium)' }}
    >
      {/* 2nd | 1st | 3rd */}
      <PodiumItem ranked={top3[1]} isCenter={false} />
      <PodiumItem ranked={top3[0]} isCenter />
      <PodiumItem ranked={top3[2]} isCenter={false} />
    </div>
  )
}
