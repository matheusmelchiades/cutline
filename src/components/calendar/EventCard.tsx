import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import type { MockEvent } from '@/types/mock'

interface EventCardProps {
  event: MockEvent
}

const EVENT_STATUS_CONFIG: Record<
  MockEvent['status'],
  { label: string; classes: string }
> = {
  completed: {
    label: 'Completed',
    classes: 'bg-locked/15 text-locked border-locked/30',
  },
  live: {
    label: 'LIVE',
    classes: 'bg-eliminated/15 text-eliminated border-eliminated/30 animate-pulse',
  },
  upcoming: {
    label: 'Upcoming',
    classes: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
  },
  cancelled: {
    label: 'Cancelled',
    classes: 'bg-locked/15 text-text-muted border-locked/30 line-through',
  },
}

export function EventCard({ event }: EventCardProps) {
  const statusConfig = EVENT_STATUS_CONFIG[event.status]

  return (
    <div className="rounded-lg bg-surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        {/* Event info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold text-text-1">
              {event.name}
            </h3>
            {event.isPipeline && (
              <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-white">
                Pipeline x1.5
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] text-text-2">
            {event.location}
          </p>
          <p className="mt-0.5 text-[13px] text-text-3">
            {formatDate(event.startDate)} — {formatDate(event.endDate)}
          </p>
        </div>

        {/* Status + Round */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
              statusConfig.classes
            )}
          >
            {statusConfig.label}
          </span>
          <span className="text-[11px] font-medium text-text-3">
            Stop #{event.round}
          </span>
        </div>
      </div>
    </div>
  )
}
