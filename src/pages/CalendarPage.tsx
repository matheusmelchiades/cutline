import { PageContainer } from '@/components/layout/PageContainer'
import { EventList } from '@/components/calendar/EventList'
import { AdSidebar } from '@/components/ads/AdSidebar'
import { MOCK_EVENTS } from '@/types/mock'

export function CalendarPage() {
  return (
    <PageContainer
      sidebar={
        <div className="space-y-6">
          <AdSidebar />
        </div>
      }
    >
      <h1 className="mb-6 text-2xl font-bold text-text-1">
        2026 Championship Tour
      </h1>
      <EventList events={MOCK_EVENTS} />
    </PageContainer>
  )
}
