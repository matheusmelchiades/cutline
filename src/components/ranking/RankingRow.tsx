import { cn } from '@/lib/cn'
import { formatPoints, formatDelta } from '@/lib/format'
import { StatusBadge } from '@/components/ranking/StatusBadge'
import type { MockRankedSurfer } from '@/types/mock'

interface RankingRowProps {
  ranked: MockRankedSurfer
  onClick: () => void
}

function getRankColor(rank: number): string {
  if (rank === 1) return 'text-gold'
  if (rank === 2) return 'text-silver'
  if (rank === 3) return 'text-bronze'
  return 'text-text-2'
}

function getDeltaColor(change: number): string {
  if (change > 0) return 'text-classified'
  if (change < 0) return 'text-eliminated'
  return 'text-text-3'
}

export function RankingRow({ ranked, onClick }: RankingRowProps) {
  const { surfer, rank, totalPoints, status, positionChange } = ranked
  const initials = surfer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-surface-input px-4 py-3 text-left transition-colors hover:bg-surface-input"
    >
      {/* Rank */}
      <span
        className={cn(
          'w-8 shrink-0 text-center text-lg font-extrabold',
          getRankColor(rank)
        )}
      >
        {rank}
      </span>

      {/* Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-input text-[13px] font-semibold text-text-2">
        {initials}
      </div>

      {/* Name + Country */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-text-1">
          {surfer.name}
        </p>
        <p className="text-[13px] text-text-2">
          {surfer.countryFlag} {surfer.country}
        </p>
      </div>

      {/* Points */}
      <span className="shrink-0 text-base font-semibold tabular-nums text-text-1">
        {formatPoints(totalPoints)}
      </span>

      {/* Delta */}
      <span
        className={cn(
          'w-10 shrink-0 text-center text-[13px] font-medium',
          getDeltaColor(positionChange)
        )}
      >
        {formatDelta(positionChange)}
      </span>

      {/* Status */}
      <div className="hidden shrink-0 sm:block">
        <StatusBadge status={status} />
      </div>
    </button>
  )
}
