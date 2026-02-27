import { describe, it, expect } from 'vitest'
import {
  applyDiscards,
  calculateTotalPoints,
  sortWithTiebreaker,
  calculateRanking,
} from '@/engine/ranking'
import type {
  EventResult,
  Surfer,
  Season,
  RankedSurfer,
} from '@/engine/types'

// Helper factories
function makeResult(
  surferId: string,
  eventId: string,
  points: number,
): EventResult {
  return { surferId, eventId, placement: 1, points }
}

function makeSurfer(id: string, name: string): Surfer {
  return {
    id,
    name,
    country: 'US',
    countryFlag: '🇺🇸',
    seed: 1,
  }
}

function makeSeason(overrides?: Partial<Season>): Season {
  return {
    year: 2026,
    totalEvents: 12,
    completedEvents: 6,
    bestOfForTitle: 9,
    bestOfForCutoff: 7,
    cutoffRank: 24,
    ...overrides,
  }
}

describe('applyDiscards', () => {
  it('keeps all results when count <= bestN', () => {
    const results: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 7800),
      makeResult('s1', 'e3', 6085),
    ]

    const { counted, discarded } = applyDiscards(results, 9)
    expect(counted).toHaveLength(3)
    expect(discarded).toHaveLength(0)
  })

  it('discards worst results when count > bestN', () => {
    const results: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 7800),
      makeResult('s1', 'e3', 6085),
      makeResult('s1', 'e4', 4745),
      makeResult('s1', 'e5', 1330), // worst — should be discarded
    ]

    const { counted, discarded } = applyDiscards(results, 4)
    expect(counted).toHaveLength(4)
    expect(discarded).toHaveLength(1)
    expect(discarded[0].points).toBe(1330)
  })

  it('keeps N best and discards rest when many results', () => {
    const results: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 7800),
      makeResult('s1', 'e3', 6085),
      makeResult('s1', 'e4', 4745),
      makeResult('s1', 'e5', 3320),
      makeResult('s1', 'e6', 2590),
      makeResult('s1', 'e7', 2020),
      makeResult('s1', 'e8', 1575),
      makeResult('s1', 'e9', 1330),
      makeResult('s1', 'e10', 1330),
      makeResult('s1', 'e11', 1330),
      makeResult('s1', 'e12', 1330),
    ]

    const { counted, discarded } = applyDiscards(results, 9)
    expect(counted).toHaveLength(9)
    expect(discarded).toHaveLength(3)

    // All discarded should be the 3 worst (1330 each)
    for (const d of discarded) {
      expect(d.points).toBe(1330)
    }

    // Best should be included
    expect(counted.map((r) => r.points)).toContain(10000)
    expect(counted.map((r) => r.points)).toContain(7800)
  })

  it('handles empty results array', () => {
    const { counted, discarded } = applyDiscards([], 9)
    expect(counted).toHaveLength(0)
    expect(discarded).toHaveLength(0)
  })

  it('handles bestN of 0', () => {
    const results: EventResult[] = [makeResult('s1', 'e1', 10000)]
    const { counted, discarded } = applyDiscards(results, 0)
    expect(counted).toHaveLength(0)
    expect(discarded).toHaveLength(1)
  })
})

describe('calculateTotalPoints', () => {
  it('sums all points correctly', () => {
    const results: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 7800),
      makeResult('s1', 'e3', 6085),
    ]
    expect(calculateTotalPoints(results)).toBe(23885)
  })

  it('returns 0 for empty array', () => {
    expect(calculateTotalPoints([])).toBe(0)
  })

  it('returns single result points for one result', () => {
    expect(calculateTotalPoints([makeResult('s1', 'e1', 4745)])).toBe(4745)
  })
})

describe('sortWithTiebreaker', () => {
  it('sorts by totalPoints descending', () => {
    const surfers: RankedSurfer[] = [
      {
        surfer: makeSurfer('s1', 'Surfer A'),
        rank: 0,
        totalPoints: 20000,
        countedResults: [makeResult('s1', 'e1', 10000), makeResult('s1', 'e2', 10000)],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
      {
        surfer: makeSurfer('s2', 'Surfer B'),
        rank: 0,
        totalPoints: 30000,
        countedResults: [makeResult('s2', 'e1', 10000), makeResult('s2', 'e2', 10000), makeResult('s2', 'e3', 10000)],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
    ]

    const sorted = sortWithTiebreaker(surfers)
    expect(sorted[0].surfer.id).toBe('s2')
    expect(sorted[0].rank).toBe(1)
    expect(sorted[1].surfer.id).toBe('s1')
    expect(sorted[1].rank).toBe(2)
  })

  it('breaks ties by best individual result', () => {
    const surfers: RankedSurfer[] = [
      {
        surfer: makeSurfer('s1', 'Surfer A'),
        rank: 0,
        totalPoints: 17800,
        countedResults: [
          makeResult('s1', 'e1', 10000),
          makeResult('s1', 'e2', 7800),
        ],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
      {
        surfer: makeSurfer('s2', 'Surfer B'),
        rank: 0,
        totalPoints: 17800,
        countedResults: [
          makeResult('s2', 'e1', 7800),
          makeResult('s2', 'e2', 10000),
        ],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
    ]

    const sorted = sortWithTiebreaker(surfers)
    // Both have 17800 total and same best result (10000), same 2nd best (7800)
    // True tie — order may be either way, but ranks should both be assigned
    expect(sorted[0].rank).toBe(1)
    expect(sorted[1].rank).toBe(2)
  })

  it('breaks tie by second best when first results are identical', () => {
    const surfers: RankedSurfer[] = [
      {
        surfer: makeSurfer('s1', 'Surfer A'),
        rank: 0,
        totalPoints: 16085,
        countedResults: [
          makeResult('s1', 'e1', 10000),
          makeResult('s1', 'e2', 6085),
        ],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
      {
        surfer: makeSurfer('s2', 'Surfer B'),
        rank: 0,
        totalPoints: 16085, // same total but different distribution
        countedResults: [
          makeResult('s2', 'e1', 10000),
          makeResult('s2', 'e2', 4745),
          makeResult('s2', 'e3', 1340), // hypothetical scenario giving same total
        ],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
    ]

    // We need same total. Let's fix: s1 = 10000+6085 = 16085, s2 = 10000+4745+1340 = 16085
    // Best: both 10000. Second best: s1=6085 vs s2=4745. s1 wins tiebreaker.
    const sorted = sortWithTiebreaker(surfers)
    expect(sorted[0].surfer.id).toBe('s1')
    expect(sorted[1].surfer.id).toBe('s2')
  })

  it('assigns correct rank numbers', () => {
    const surfers: RankedSurfer[] = [
      {
        surfer: makeSurfer('s1', 'A'),
        rank: 0,
        totalPoints: 30000,
        countedResults: [],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
      {
        surfer: makeSurfer('s2', 'B'),
        rank: 0,
        totalPoints: 20000,
        countedResults: [],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
      {
        surfer: makeSurfer('s3', 'C'),
        rank: 0,
        totalPoints: 10000,
        countedResults: [],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
    ]

    const sorted = sortWithTiebreaker(surfers)
    expect(sorted[0].rank).toBe(1)
    expect(sorted[1].rank).toBe(2)
    expect(sorted[2].rank).toBe(3)
  })
})

describe('calculateRanking', () => {
  it('calculates ranking for multiple surfers with results', () => {
    const surfers: Surfer[] = [
      makeSurfer('s1', 'John Florence'),
      makeSurfer('s2', 'Filipe Toledo'),
      makeSurfer('s3', 'Gabriel Medina'),
    ]

    const results: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 7800),
      makeResult('s2', 'e1', 7800),
      makeResult('s2', 'e2', 10000),
      makeResult('s3', 'e1', 6085),
      makeResult('s3', 'e2', 4745),
    ]

    const season = makeSeason({ completedEvents: 2 })
    const ranking = calculateRanking(surfers, results, season)

    expect(ranking).toHaveLength(3)
    // s1 and s2 both have 17800 points — tiebreaker will apply
    expect(ranking[0].totalPoints).toBe(17800)
    expect(ranking[1].totalPoints).toBe(17800)
    expect(ranking[2].totalPoints).toBe(10830)
    expect(ranking[2].surfer.id).toBe('s3')
  })

  it('puts surfer with no results at the end with 0 points', () => {
    const surfers: Surfer[] = [
      makeSurfer('s1', 'Active Surfer'),
      makeSurfer('s2', 'No Results'),
    ]

    const results: EventResult[] = [makeResult('s1', 'e1', 10000)]

    const season = makeSeason({ completedEvents: 1 })
    const ranking = calculateRanking(surfers, results, season)

    expect(ranking[0].surfer.id).toBe('s1')
    expect(ranking[0].totalPoints).toBe(10000)
    expect(ranking[1].surfer.id).toBe('s2')
    expect(ranking[1].totalPoints).toBe(0)
  })

  it('applies discards when results exceed bestOfForTitle', () => {
    const surfers: Surfer[] = [makeSurfer('s1', 'Surfer')]

    // 12 results, bestOfForTitle = 9, so 3 worst should be discarded
    const results: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 7800),
      makeResult('s1', 'e3', 6085),
      makeResult('s1', 'e4', 4745),
      makeResult('s1', 'e5', 3320),
      makeResult('s1', 'e6', 2590),
      makeResult('s1', 'e7', 2020),
      makeResult('s1', 'e8', 1575),
      makeResult('s1', 'e9', 1330),
      makeResult('s1', 'e10', 1330), // discarded
      makeResult('s1', 'e11', 1330), // discarded
      makeResult('s1', 'e12', 1330), // discarded
    ]

    const season = makeSeason({ completedEvents: 12 })
    const ranking = calculateRanking(surfers, results, season)

    expect(ranking[0].countedResults).toHaveLength(9)
    expect(ranking[0].discardedResults).toHaveLength(3)
    // Sum of top 9: 10000+7800+6085+4745+3320+2590+2020+1575+1330 = 39465
    expect(ranking[0].totalPoints).toBe(39465)
  })

  it('does not discard when results < bestOfForTitle', () => {
    const surfers: Surfer[] = [makeSurfer('s1', 'Surfer')]

    const results: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 7800),
    ]

    const season = makeSeason({ completedEvents: 2 })
    const ranking = calculateRanking(surfers, results, season)

    expect(ranking[0].countedResults).toHaveLength(2)
    expect(ranking[0].discardedResults).toHaveLength(0)
    expect(ranking[0].totalPoints).toBe(17800)
  })

  it('assigns default status of risk', () => {
    const surfers: Surfer[] = [makeSurfer('s1', 'Surfer')]
    const results: EventResult[] = [makeResult('s1', 'e1', 10000)]
    const season = makeSeason()

    const ranking = calculateRanking(surfers, results, season)
    expect(ranking[0].status).toBe('risk')
  })
})
