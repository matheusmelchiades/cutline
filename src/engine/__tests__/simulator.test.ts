import { describe, it, expect } from 'vitest'
import { simulateScenario, compareRankings } from '@/engine/simulator'
import type {
  Surfer,
  EventResult,
  Season,
  RankedSurfer,
  SimulationInput,
} from '@/engine/types'

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
    completedEvents: 3,
    bestOfForTitle: 9,
    bestOfForCutoff: 7,
    cutoffRank: 24,
    ...overrides,
  }
}

describe('simulateScenario', () => {
  it('correctly changes ranking when a lower surfer wins', () => {
    const surfers: Surfer[] = [
      makeSurfer('s1', 'Leader'),
      makeSurfer('s2', 'Challenger'),
    ]

    const currentResults: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s1', 'e2', 10000),
      makeResult('s2', 'e1', 7800),
      makeResult('s2', 'e2', 7800),
    ]

    const season = makeSeason({ completedEvents: 2 })

    // Simulate: s2 wins event 3, s1 gets 33rd
    const hypothetical: SimulationInput = {
      hypotheticalResults: [
        { eventId: 'e3', surferId: 's2', placement: 1 },
        { eventId: 'e3', surferId: 's1', placement: 33 },
      ],
    }

    const result = simulateScenario(surfers, currentResults, hypothetical, season)

    // After: s1 has 20000+1330=21330, s2 has 15600+10000=25600
    // s2 should now be ranked higher
    expect(result.rankings[0].surfer.id).toBe('s2')
    expect(result.rankings[1].surfer.id).toBe('s1')
  })

  it('applies Pipeline multiplier in simulation', () => {
    const surfers: Surfer[] = [makeSurfer('s1', 'Surfer')]

    const currentResults: EventResult[] = [makeResult('s1', 'e1', 10000)]

    const season = makeSeason({ completedEvents: 1 })

    const events = [
      { id: 'e1', isPipeline: false },
      { id: 'e2', isPipeline: true },
    ]

    const hypothetical: SimulationInput = {
      hypotheticalResults: [
        { eventId: 'e2', surferId: 's1', placement: 1 },
      ],
    }

    const result = simulateScenario(
      surfers,
      currentResults,
      hypothetical,
      season,
      events,
    )

    // e1: 10000, e2 Pipeline win: 15000 → total: 25000
    expect(result.rankings[0].totalPoints).toBe(25000)
  })

  it('returns empty changes when no surfers matched', () => {
    const surfers: Surfer[] = [makeSurfer('s1', 'Surfer')]
    const currentResults: EventResult[] = [makeResult('s1', 'e1', 10000)]
    const season = makeSeason({ completedEvents: 1 })

    const hypothetical: SimulationInput = {
      hypotheticalResults: [],
    }

    const result = simulateScenario(surfers, currentResults, hypothetical, season)

    // No hypothetical results, ranking should be the same
    expect(result.changes).toHaveLength(1)
    expect(result.changes[0].rankBefore).toBe(result.changes[0].rankAfter)
    expect(result.changes[0].pointsBefore).toBe(result.changes[0].pointsAfter)
  })
})

describe('compareRankings', () => {
  it('detects rank changes between two ranking snapshots', () => {
    const surfers = [makeSurfer('s1', 'A'), makeSurfer('s2', 'B')]

    const before: RankedSurfer[] = [
      {
        surfer: surfers[0],
        rank: 1,
        totalPoints: 20000,
        countedResults: [],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
      {
        surfer: surfers[1],
        rank: 2,
        totalPoints: 15000,
        countedResults: [],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
    ]

    const after: RankedSurfer[] = [
      {
        surfer: surfers[1],
        rank: 1,
        totalPoints: 25000,
        countedResults: [],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
      {
        surfer: surfers[0],
        rank: 2,
        totalPoints: 20000,
        countedResults: [],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
    ]

    const changes = compareRankings(before, after)

    expect(changes).toHaveLength(2)

    const s1Change = changes.find((c) => c.surferId === 's1')!
    expect(s1Change.rankBefore).toBe(1)
    expect(s1Change.rankAfter).toBe(2)

    const s2Change = changes.find((c) => c.surferId === 's2')!
    expect(s2Change.rankBefore).toBe(2)
    expect(s2Change.rankAfter).toBe(1)
    expect(s2Change.pointsBefore).toBe(15000)
    expect(s2Change.pointsAfter).toBe(25000)
  })

  it('handles no changes', () => {
    const surfer = makeSurfer('s1', 'A')
    const ranked: RankedSurfer = {
      surfer,
      rank: 1,
      totalPoints: 10000,
      countedResults: [],
      discardedResults: [],
      status: 'risk',
      positionChange: 0,
    }

    const changes = compareRankings([ranked], [ranked])

    expect(changes).toHaveLength(1)
    expect(changes[0].rankBefore).toBe(changes[0].rankAfter)
    expect(changes[0].pointsBefore).toBe(changes[0].pointsAfter)
  })
})
