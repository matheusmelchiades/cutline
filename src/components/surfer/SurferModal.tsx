import { X } from 'lucide-react'
import { formatPoints } from '@/lib/format'
import { StatusBadge } from '@/components/ranking/StatusBadge'
import type { MockRankedSurfer } from '@/types/mock'

interface SurferModalProps {
  surfer: MockRankedSurfer | null
  onClose: () => void
}

export function SurferModal({ surfer, onClose }: SurferModalProps) {
  if (!surfer) return null

  const initials = surfer.surfer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-t-2xl bg-surface-card p-6 sm:rounded-2xl">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-text-2 transition-colors hover:bg-surface-input hover:text-text-1"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-input text-xl font-bold text-text-2">
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {surfer.surfer.name}
            </h2>
            <p className="text-[15px] text-text-2">
              {surfer.surfer.countryFlag} {surfer.surfer.country}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <StatCard label="Rank" value={`#${surfer.rank}`} />
          <StatCard label="Points" value={formatPoints(surfer.totalPoints)} />
          <StatCard label="Best Result" value="--" />
          <StatCard label="Events" value="1 / 12" />
        </div>

        {/* Status */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-[13px] font-medium text-text-2">Status:</span>
          <StatusBadge status={surfer.status} size="md" />
        </div>

        {/* Scenarios placeholder */}
        <div className="rounded-lg bg-surface-input p-4 text-center text-[13px] text-text-3">
          Scenarios loading...
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-input p-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-text-3">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold tabular-nums text-text-1">
        {value}
      </p>
    </div>
  )
}
