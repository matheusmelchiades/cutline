import { EventCard } from '@/components/calendar/EventCard'
import type { MockEvent } from '@/types/mock'

interface EventListProps {
  events: MockEvent[]
}

export function EventList({ events }: EventListProps) {
  const completed = events.filter((e) => e.status === 'completed')
  const live = events.filter((e) => e.status === 'live')
  const upcoming = events.filter((e) => e.status === 'upcoming')

  return (
    <div className="space-y-6">
      {/* Live events */}
      {live.length > 0 && (
        <section>
          <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-eliminated">
            Live Now
          </h3>
          <div className="space-y-3">
            {live.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Completed events */}
      {completed.length > 0 && (
        <section>
          <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-text-3">
            Completed
          </h3>
          <div className="space-y-3">
            {completed.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <section>
          <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-text-2">
            Upcoming
          </h3>
          <div className="space-y-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
