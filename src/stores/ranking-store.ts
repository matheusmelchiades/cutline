import { create } from 'zustand'
import type { Surfer, Event, EventResult, Season, RankedSurfer } from '@/engine/types'
import { calculateRanking } from '@/engine/ranking'
import { getStatus } from '@/engine/elimination'
import rawSurfers from '@/data/surfers-ct-2026.json'
import rawEvents from '@/data/events-ct-2026.json'
import rawResults from '@/data/results-ct-2026.json'

const surfers = rawSurfers as Surfer[]
const events = rawEvents as Event[]
const results = rawResults as EventResult[]

const SEASON_2026: Season = {
  year: 2026,
  totalEvents: 12,
  completedEvents: events.filter((e) => e.status === 'completed').length,
  bestOfForTitle: 9,
  bestOfForCutoff: 7,
  cutoffRank: 24,
}

function computeRankings(
  currentSurfers: Surfer[],
  currentResults: EventResult[],
  season: Season,
): RankedSurfer[] {
  const ranked = calculateRanking(currentSurfers, currentResults, season)

  // Enrich each surfer with computed status
  return ranked.map((r) => ({
    ...r,
    status: getStatus(r.surfer, r.rank, currentResults, ranked, season, events),
  }))
}

type TourFilter = 'ct' | 'cs'
type GenderFilter = 'men' | 'women'

interface RankingStore {
  surfers: Surfer[]
  events: Event[]
  results: EventResult[]
  rankings: RankedSurfer[]
  season: Season
  tourFilter: TourFilter
  genderFilter: GenderFilter
  setTourFilter: (tour: TourFilter) => void
  setGenderFilter: (gender: GenderFilter) => void
}

export const useRankingStore = create<RankingStore>()((set) => ({
  surfers,
  events,
  results,
  season: SEASON_2026,
  rankings: computeRankings(surfers, results, SEASON_2026),
  tourFilter: 'ct',
  genderFilter: 'men',

  setTourFilter: (tour) => set({ tourFilter: tour }),
  setGenderFilter: (gender) => set({ genderFilter: gender }),
}))
