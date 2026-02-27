import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PillFilters } from '@/components/ranking/PillFilters'
import { RankingList } from '@/components/ranking/RankingList'
import { SurferModal } from '@/components/surfer/SurferModal'
import { AdSidebar } from '@/components/ads/AdSidebar'
import { AdBanner } from '@/components/ads/AdBanner'
import { MOCK_RANKINGS } from '@/types/mock'

const TOUR_OPTIONS = [
  { label: 'CT', value: 'ct' },
  { label: 'CS', value: 'cs' },
]

const GENDER_OPTIONS = [
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
]

export function RankingsPage() {
  const [tour, setTour] = useState('ct')
  const [gender, setGender] = useState('men')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedSurfer = MOCK_RANKINGS.find(
    (r) => r.surfer.id === selectedId
  ) ?? null

  return (
    <PageContainer
      sidebar={
        <div className="space-y-6">
          <AdSidebar />
        </div>
      }
    >
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <PillFilters options={TOUR_OPTIONS} value={tour} onChange={setTour} />
        <PillFilters
          options={GENDER_OPTIONS}
          value={gender}
          onChange={setGender}
        />
      </div>

      {/* Ad banner (mobile) */}
      <div className="mb-4 lg:hidden">
        <AdBanner />
      </div>

      {/* Rankings */}
      <RankingList
        rankings={MOCK_RANKINGS}
        onSurferClick={setSelectedId}
      />

      {/* Surfer modal */}
      <SurferModal
        surfer={selectedSurfer}
        onClose={() => setSelectedId(null)}
      />
    </PageContainer>
  )
}
