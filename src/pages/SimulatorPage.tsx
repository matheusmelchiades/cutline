import { PageContainer } from '@/components/layout/PageContainer'
import { AdSidebar } from '@/components/ads/AdSidebar'
import { useRankingStore } from '@/stores/ranking-store'
import { formatDate } from '@/lib/format'

export function SimulatorPage() {
  const { events } = useRankingStore()
  const upcomingEvents = events.filter((e) => e.status === 'upcoming')

  return (
    <PageContainer sidebar={<AdSidebar />}>
      <h1 className="mb-6 text-2xl font-bold text-text-1">
        Scenario Simulator
      </h1>

      {/* Placeholder card */}
      <div className="mb-6 rounded-lg bg-surface-card p-6 text-center">
        <p className="text-[15px] text-text-2">
          Select outcomes for upcoming events to see ranking changes.
        </p>
        <p className="mt-2 text-[13px] text-text-3">
          Full simulator coming soon.
        </p>
      </div>

      {/* Upcoming events list */}
      <h2 className="mb-4 text-lg font-bold text-text-1">Upcoming Events</h2>
      <div className="space-y-3">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between rounded-lg bg-surface-card p-4"
          >
            <div>
              <p className="text-[15px] font-semibold text-text-1">
                {event.name}
              </p>
              <p className="mt-0.5 text-[13px] text-text-3">
                {event.location} &middot; {formatDate(event.startDate)}
              </p>
            </div>
            <div className="rounded-lg bg-surface-input px-3 py-2 text-[13px] text-text-3">
              Select result...
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
