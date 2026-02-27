import { cn } from '@/lib/cn'
import type { SurferStatus } from '@/types/mock'

interface StatusBadgeProps {
  status: SurferStatus
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<SurferStatus, { label: string; classes: string }> = {
  classified: {
    label: 'Classified',
    classes: 'bg-classified/15 text-classified border-classified/30',
  },
  risk: {
    label: 'At Risk',
    classes: 'bg-risk/15 text-risk border-risk/30',
  },
  eliminated: {
    label: 'Eliminated',
    classes: 'bg-eliminated/15 text-eliminated border-eliminated/30',
  },
  locked: {
    label: 'Locked In',
    classes: 'bg-locked/15 text-locked border-locked/30',
  },
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold',
        config.classes,
        size === 'sm' && 'px-2 py-0.5 text-[11px] leading-tight',
        size === 'md' && 'px-3 py-1 text-[13px] leading-tight'
      )}
    >
      {config.label}
    </span>
  )
}
