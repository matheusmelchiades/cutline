import { PageContainer } from '@/components/layout/PageContainer'
import { PillFilters } from '@/components/ranking/PillFilters'
import { RankingList } from '@/components/ranking/RankingList'
import { SurferModal } from '@/components/surfer/SurferModal'
import { AdSidebar } from '@/components/ads/AdSidebar'
import { AdBanner } from '@/components/ads/AdBanner'
import { useRankingStore } from '@/stores/ranking-store'
import { useUIStore } from '@/stores/ui-store'

const TOUR_OPTIONS = [
  { label: 'CT', value: 'ct' },
  { label: 'CS', value: 'cs' },
]

const GENDER_OPTIONS = [
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
]

export function RankingsPage() {
  const { rankings, tourFilter, genderFilter, setTourFilter, setGenderFilter } =
    useRankingStore()
  const { selectedSurferId, setSelectedSurferId } = useUIStore()

  const selectedSurfer = rankings.find((r) => r.surfer.id === selectedSurferId) ?? null

  return (
    <PageContainer sidebar={<AdSidebar />}>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <PillFilters options={TOUR_OPTIONS} value={tourFilter} onChange={(v) => setTourFilter(v as 'ct' | 'cs')} />
        <PillFilters options={GENDER_OPTIONS} value={genderFilter} onChange={(v) => setGenderFilter(v as 'men' | 'women')} />
      </div>

      {/* Ad banner (mobile only) */}
      <div className="mb-4 lg:hidden">
        <AdBanner />
      </div>

      {/* Rankings */}
      <RankingList rankings={rankings} onSurferClick={setSelectedSurferId} />

      {/* Surfer modal */}
      <SurferModal surfer={selectedSurfer} onClose={() => setSelectedSurferId(null)} />
    </PageContainer>
  )
}
