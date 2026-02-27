import { PageContainer } from '@/components/layout/PageContainer'
import { EventList } from '@/components/calendar/EventList'
import { AdSidebar } from '@/components/ads/AdSidebar'
import { useRankingStore } from '@/stores/ranking-store'

export function CalendarPage() {
  const { events } = useRankingStore()

  return (
    <PageContainer sidebar={<AdSidebar />}>
      <h1 className="mb-6 text-2xl font-bold text-text-1">
        2026 Championship Tour
      </h1>
      <EventList events={events} />
    </PageContainer>
  )
}
