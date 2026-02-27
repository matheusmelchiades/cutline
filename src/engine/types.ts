/** Possible placements in a CT event */
export type Placement = 1 | 2 | 3 | 5 | 9 | 13 | 17 | 25 | 33

export interface Surfer {
  id: string
  name: string
  country: string // ISO 3166-1 alpha-2 (BR, AU, US...)
  countryFlag: string // emoji flag
  seed: number // original seed for the season
  isWildcard?: boolean
}

export interface EventResult {
  surferId: string
  eventId: string
  placement: Placement
  points: number // already includes Pipeline multiplier if applicable
}

export interface Event {
  id: string
  name: string
  location: string
  country: string
  startDate: string // ISO 8601
  endDate: string
  status: 'completed' | 'live' | 'upcoming' | 'cancelled'
  isPipeline: boolean // if true: points x 1.5
  round: number // 1-12 (position in the season)
}

export interface Season {
  year: number
  totalEvents: number // 12 for CT 2026
  completedEvents: number
  bestOfForTitle: number // 9 (best 9 of 12 for title)
  bestOfForCutoff: number // 7 (best 7 of 9 for post-season)
  cutoffRank: number // 24 (men) - top N advance to post-season
}

export type SurferStatus = 'classified' | 'risk' | 'eliminated' | 'locked'

export interface RankedSurfer {
  surfer: Surfer
  rank: number
  totalPoints: number // points with discards applied
  countedResults: EventResult[] // the N best
  discardedResults: EventResult[] // the discarded ones
  status: SurferStatus
  positionChange: number // +2, -1, 0 (vs previous round)
}

export interface SimulationInput {
  hypotheticalResults: Array<{
    eventId: string
    surferId: string
    placement: Placement
  }>
}

export interface SimulationResult {
  rankings: RankedSurfer[]
  changes: Array<{
    surferId: string
    rankBefore: number
    rankAfter: number
    pointsBefore: number
    pointsAfter: number
  }>
}

export interface QuickInsight {
  type: 'leader' | 'cutline' | 'eliminated' | 'clinched'
  message: string
  surferId?: string
}
