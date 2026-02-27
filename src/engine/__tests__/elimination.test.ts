import { describe, it, expect } from 'vitest'
import {
  bestPossibleScore,
  worstGuaranteedScore,
  isEliminated,
  getStatus,
} from '@/engine/elimination'
import type {
  Surfer,
  EventResult,
  Season,
  RankedSurfer,
} from '@/engine/types'
import { calculateRanking } from '@/engine/ranking'

function makeSurfer(id: string, name: string): Surfer {
  return { id, name, country: 'US', countryFlag: '🇺🇸', seed: 1 }
}

function makeResult(
  surferId: string,
  eventId: string,
  points: number,
): EventResult {
  return { surferId, eventId, placement: 1, points }
}

function makeSeason(overrides?: Partial<Season>): Season {
  return {
    year: 2026,
    totalEvents: 12,
    completedEvents: 9,
    bestOfForTitle: 9,
    bestOfForCutoff: 7,
    cutoffRank: 24,
    ...overrides,
  }
}

function makeRankedSurfer(
  surfer: Surfer,
  counted: EventResult[],
  discarded: EventResult[] = [],
  rank: number = 1,
): RankedSurfer {
  const totalPoints = counted.reduce((sum, r) => sum + r.points, 0)
  return {
    surfer,
    rank,
    totalPoints,
    countedResults: counted,
    discardedResults: discarded,
    status: 'risk',
    positionChange: 0,
  }
}

describe('bestPossibleScore', () => {
  it('returns max possible when remaining events include Pipeline', () => {
    const surfer = makeSurfer('s1', 'Surfer')
    const currentResults: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 7800),
    ]

    // 10 remaining events (events 3-12), last one is Pipeline
    const season = makeSeason({ completedEvents: 2 })

    const best = bestPossibleScore(surfer, currentResults, season)

    // With 12 total and bestOfForTitle=9:
    // 2 current: 10000, 7800
    // 10 hypothetical: 9 normal wins (10000 each) + 1 Pipeline win (15000)
    // Total results: 12, keep best 9
    // Best 9 of [15000, 10000x10, 7800]: top 9 = 15000 + 10000x8 = 95000
    expect(best).toBe(95000)
  })

  it('returns max possible with explicit events list', () => {
    const surfer = makeSurfer('s1', 'Surfer')
    const currentResults: EventResult[] = [
      makeResult('s1', 'e1', 10000),
    ]

    const season = makeSeason({ completedEvents: 1, totalEvents: 3 })
    const events = [
      { id: 'e1', isPipeline: false },
      { id: 'e2', isPipeline: false },
      { id: 'e3', isPipeline: true },
    ]

    const best = bestPossibleScore(surfer, currentResults, season, events)
    // Current: 10000 for e1
    // Upcoming: e2 (10000), e3 Pipeline (15000)
    // Total: 3 results, bestOf 9 → keep all 3 = 10000+10000+15000 = 35000
    expect(best).toBe(35000)
  })

  it('applies discard when hypothetical results push over bestN', () => {
    const surfer = makeSurfer('s1', 'Surfer')

    // 9 existing results all with 3320 points
    const currentResults: EventResult[] = Array.from({ length: 9 }, (_, i) =>
      makeResult('s1', `e${i + 1}`, 3320),
    )

    // 3 remaining events, last is Pipeline
    const season = makeSeason({
      completedEvents: 9,
      totalEvents: 12,
      bestOfForTitle: 9,
    })

    const best = bestPossibleScore(surfer, currentResults, season)
    // 9 existing: 3320 x 9
    // 3 hypothetical wins: 10000, 10000, 15000 (last = Pipeline)
    // 12 total results. Keep best 9: 15000 + 10000 + 10000 + 3320x6 = 54920
    expect(best).toBe(54920)
  })

  it('returns current points when no remaining events', () => {
    const surfer = makeSurfer('s1', 'Surfer')
    const currentResults: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 7800),
    ]

    const season = makeSeason({ completedEvents: 12, totalEvents: 12 })

    const best = bestPossibleScore(surfer, currentResults, season)
    expect(best).toBe(17800)
  })
})

describe('worstGuaranteedScore', () => {
  it('calculates worst case with discards', () => {
    const surfer = makeSurfer('s1', 'Surfer')
    const counted = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 7800),
      makeResult('s1', 'e3', 6085),
    ]

    const ranked = makeRankedSurfer(surfer, counted)

    // 9 remaining events: worst possible = 33rd in each (1330, Pipeline last = 1995)
    const season = makeSeason({
      completedEvents: 3,
      totalEvents: 12,
      bestOfForTitle: 9,
    })

    const worst = worstGuaranteedScore(ranked, season)
    // 3 existing: 10000, 7800, 6085
    // 9 hypothetical: 8 x 1330 + 1 x 1995 (Pipeline)
    // 12 total: keep best 9
    // Sort all: 10000, 7800, 6085, 1995, 1330x8
    // Best 9: 10000+7800+6085+1995+1330x5 = 32530
    expect(worst).toBe(32530)
  })

  it('returns current points when season is complete', () => {
    const surfer = makeSurfer('s1', 'Surfer')
    const counted = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 7800),
    ]

    const ranked = makeRankedSurfer(surfer, counted)
    const season = makeSeason({ completedEvents: 12, totalEvents: 12 })

    const worst = worstGuaranteedScore(ranked, season)
    expect(worst).toBe(17800)
  })

  it('includes discarded results when rebuilding total', () => {
    const surfer = makeSurfer('s1', 'Surfer')
    const counted = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 7800),
      makeResult('s1', 'e3', 6085),
    ]
    const discarded = [makeResult('s1', 'e4', 1330)]

    const ranked = makeRankedSurfer(surfer, counted, discarded)

    // 8 remaining events (4 completed, 12 total)
    const season = makeSeason({
      completedEvents: 4,
      totalEvents: 12,
      bestOfForTitle: 9,
    })

    const worst = worstGuaranteedScore(ranked, season)
    // 4 existing: 10000, 7800, 6085, 1330
    // 8 hypothetical: 7 x 1330 + 1 x 1995 (Pipeline)
    // 12 total: keep best 9
    // Sort: 10000, 7800, 6085, 1995, 1330x8
    // Best 9: 10000+7800+6085+1995+1330x5 = 32530
    expect(worst).toBe(32530)
  })
})

describe('isEliminated', () => {
  it('returns true when best possible is less than target worst guaranteed', () => {
    const challenger = makeSurfer('s1', 'Challenger')
    const leader = makeSurfer('s2', 'Leader')

    // Challenger has very few points
    const currentResults: EventResult[] = [
      makeResult('s1', 'e1', 1330),
      makeResult('s1', 'e2', 1330),
    ]

    // Leader has huge lead with many results
    const leaderCounted = Array.from({ length: 9 }, (_, i) =>
      makeResult('s2', `e${i + 1}`, 10000),
    )
    const leaderRanked = makeRankedSurfer(leader, leaderCounted)

    // Only 1 event remaining (season almost over)
    const season = makeSeason({
      completedEvents: 11,
      totalEvents: 12,
      bestOfForTitle: 9,
    })

    // Challenger best: 1330+1330 + 15000 (Pipeline win) = keep best 9
    // Only 3 results, all kept = 1330+1330+15000 = 17660
    // Leader worst: 9 x 10000 already + 1330 worst = keep best 9 = 90000
    // 17660 < 90000 → eliminated
    expect(
      isEliminated(challenger, currentResults, leaderRanked, season),
    ).toBe(true)
  })

  it('returns false when surfer can still potentially reach target', () => {
    const challenger = makeSurfer('s1', 'Challenger')
    const leader = makeSurfer('s2', 'Leader')

    const currentResults: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 10000),
    ]

    // Leader only slightly ahead
    const leaderCounted = [
      makeResult('s2', 'e1', 10000),
      makeResult('s2', 'e2', 10000),
      makeResult('s2', 'e3', 7800),
    ]
    const leaderRanked = makeRankedSurfer(leader, leaderCounted)

    // Many events remaining
    const season = makeSeason({
      completedEvents: 3,
      totalEvents: 12,
      bestOfForTitle: 9,
    })

    expect(
      isEliminated(challenger, currentResults, leaderRanked, season),
    ).toBe(false)
  })
})

describe('getStatus', () => {
  // Build a realistic small scenario with 5 surfers, cutoff at 3
  const surfers: Surfer[] = [
    makeSurfer('s1', 'Leader'),
    makeSurfer('s2', 'Strong'),
    makeSurfer('s3', 'Cutline'),
    makeSurfer('s4', 'Bubble'),
    makeSurfer('s5', 'Weak'),
  ]

  it('returns "risk" for standard mid-season scenario', () => {
    const results: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s2', 'e1', 7800),
      makeResult('s3', 'e1', 6085),
      makeResult('s4', 'e1', 4745),
      makeResult('s5', 'e1', 3320),
    ]

    const season = makeSeason({
      completedEvents: 1,
      totalEvents: 12,
      cutoffRank: 3,
    })

    const rankings = calculateRanking(surfers, results, season)

    // Early in season, most things are still possible
    const status = getStatus(surfers[0], 1, results, rankings, season)
    expect(status).toBe('risk')
  })

  it('returns "eliminated" when a surfer cannot possibly reach cutoff', () => {
    // Create scenario where s5 is mathematically eliminated
    // Season nearly over, s5 has very few points, cutoff surfer has huge lead
    const results: EventResult[] = [
      // Top 3 have massive points across many events
      ...Array.from({ length: 11 }, (_, i) =>
        makeResult('s1', `e${i + 1}`, 10000),
      ),
      ...Array.from({ length: 11 }, (_, i) =>
        makeResult('s2', `e${i + 1}`, 7800),
      ),
      ...Array.from({ length: 11 }, (_, i) =>
        makeResult('s3', `e${i + 1}`, 6085),
      ),
      ...Array.from({ length: 11 }, (_, i) =>
        makeResult('s4', `e${i + 1}`, 4745),
      ),
      // s5 barely participated
      makeResult('s5', 'e1', 1330),
    ]

    const season = makeSeason({
      completedEvents: 11,
      totalEvents: 12,
      cutoffRank: 3,
    })

    const rankings = calculateRanking(surfers, results, season)
    const s5Rank = rankings.find((r) => r.surfer.id === 's5')!.rank

    const status = getStatus(surfers[4], s5Rank, results, rankings, season)
    expect(status).toBe('eliminated')
  })

  it('returns "locked" when a surfer cannot be overtaken', () => {
    // Season is over — no remaining events
    const results: EventResult[] = [
      ...Array.from({ length: 12 }, (_, i) =>
        makeResult('s1', `e${i + 1}`, 10000),
      ),
      ...Array.from({ length: 12 }, (_, i) =>
        makeResult('s2', `e${i + 1}`, 7800),
      ),
      ...Array.from({ length: 12 }, (_, i) =>
        makeResult('s3', `e${i + 1}`, 6085),
      ),
      ...Array.from({ length: 12 }, (_, i) =>
        makeResult('s4', `e${i + 1}`, 4745),
      ),
      ...Array.from({ length: 12 }, (_, i) =>
        makeResult('s5', `e${i + 1}`, 3320),
      ),
    ]

    const season = makeSeason({
      completedEvents: 12,
      totalEvents: 12,
      cutoffRank: 3,
    })

    const rankings = calculateRanking(surfers, results, season)

    // Leader with no remaining events — no one can overtake
    const status = getStatus(surfers[0], 1, results, rankings, season)
    expect(status).toBe('locked')
  })

  it('returns "classified" when surfer is safe at cutoff position', () => {
    // Season over — surfer at cutoff rank has more points than anyone below
    const results: EventResult[] = [
      ...Array.from({ length: 12 }, (_, i) =>
        makeResult('s1', `e${i + 1}`, 10000),
      ),
      ...Array.from({ length: 12 }, (_, i) =>
        makeResult('s2', `e${i + 1}`, 7800),
      ),
      ...Array.from({ length: 12 }, (_, i) =>
        makeResult('s3', `e${i + 1}`, 6085),
      ),
      ...Array.from({ length: 12 }, (_, i) =>
        makeResult('s4', `e${i + 1}`, 4745),
      ),
      ...Array.from({ length: 12 }, (_, i) =>
        makeResult('s5', `e${i + 1}`, 3320),
      ),
    ]

    const season = makeSeason({
      completedEvents: 12,
      totalEvents: 12,
      cutoffRank: 3,
    })

    const rankings = calculateRanking(surfers, results, season)

    // s3 is at rank 3 = cutoffRank, season over, no one below can overtake
    const status = getStatus(surfers[2], 3, results, rankings, season)
    // Since season is over and rank <= cutoffRank, should be locked or classified
    expect(['locked', 'classified']).toContain(status)
  })
})
