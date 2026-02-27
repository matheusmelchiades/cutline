import { describe, it, expect } from 'vitest'
import { whatNeedsToHappen, getQuickInsights } from '@/engine/scenarios'
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
    cutoffRank: 3,
    ...overrides,
  }
}

describe('whatNeedsToHappen', () => {
  it('returns guidance for a surfer who needs wins', () => {
    const surfers: Surfer[] = [
      makeSurfer('s1', 'Leader'),
      makeSurfer('s2', 'Cutline'),
      makeSurfer('s3', 'Cutline2'),
      makeSurfer('s4', 'Challenger'),
    ]

    // Leader has strong results, challenger is behind
    const results: EventResult[] = [
      ...Array.from({ length: 9 }, (_, i) =>
        makeResult('s1', `e${i + 1}`, 10000),
      ),
      ...Array.from({ length: 9 }, (_, i) =>
        makeResult('s2', `e${i + 1}`, 7800),
      ),
      ...Array.from({ length: 9 }, (_, i) =>
        makeResult('s3', `e${i + 1}`, 6085),
      ),
      ...Array.from({ length: 9 }, (_, i) =>
        makeResult('s4', `e${i + 1}`, 3320),
      ),
    ]

    const season = makeSeason({ completedEvents: 9 })

    const message = whatNeedsToHappen(
      surfers[3],
      3, // target: rank 3 (cutoff)
      results,
      surfers,
      season,
    )

    // Should return some actionable description
    expect(typeof message).toBe('string')
    expect(message.length).toBeGreaterThan(0)
    // Should mention "remaining" or "event" or be "Mathematically eliminated"
    expect(
      message.includes('remaining') ||
        message.includes('event') ||
        message.includes('eliminated') ||
        message.includes('Needs'),
    ).toBe(true)
  })

  it('returns "Already qualified" for surfer at target rank who is safe', () => {
    const surfers: Surfer[] = [
      makeSurfer('s1', 'Leader'),
      makeSurfer('s2', 'Second'),
      makeSurfer('s3', 'Third'),
    ]

    // Season is over, all spots are settled
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
    ]

    const season = makeSeason({
      completedEvents: 12,
      totalEvents: 12,
      cutoffRank: 3,
    })

    const message = whatNeedsToHappen(surfers[0], 3, results, surfers, season)
    expect(message).toBe('Already qualified')
  })

  it('returns elimination message when no remaining events', () => {
    const surfers: Surfer[] = [
      makeSurfer('s1', 'Leader'),
      makeSurfer('s2', 'Last'),
    ]

    const results: EventResult[] = [
      ...Array.from({ length: 12 }, (_, i) =>
        makeResult('s1', `e${i + 1}`, 10000),
      ),
      ...Array.from({ length: 12 }, (_, i) =>
        makeResult('s2', `e${i + 1}`, 1330),
      ),
    ]

    const season = makeSeason({
      completedEvents: 12,
      totalEvents: 12,
      cutoffRank: 1,
    })

    const message = whatNeedsToHappen(surfers[1], 1, results, surfers, season)
    expect(message).toBe('Season is over — mathematically eliminated')
  })

  it('returns "Surfer not found" for non-existent surfer', () => {
    const surfers: Surfer[] = [makeSurfer('s1', 'Leader')]
    const results: EventResult[] = [makeResult('s1', 'e1', 10000)]
    const season = makeSeason()

    const ghostSurfer = makeSurfer('ghost', 'Ghost')
    const message = whatNeedsToHappen(ghostSurfer, 1, results, surfers, season)
    expect(message).toBe('Surfer not found in rankings')
  })
})

describe('getQuickInsights', () => {
  it('identifies leader and margin', () => {
    const surfers: Surfer[] = [
      makeSurfer('s1', 'John Florence'),
      makeSurfer('s2', 'Filipe Toledo'),
    ]

    const results: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s2', 'e1', 7800),
    ]

    const season = makeSeason({ completedEvents: 1 })
    const rankings = calculateRanking(surfers, results, season)

    const insights = getQuickInsights(rankings, season)

    const leaderInsight = insights.find((i) => i.type === 'leader')
    expect(leaderInsight).toBeDefined()
    expect(leaderInsight!.message).toContain('John Florence')
    expect(leaderInsight!.message).toContain('2,200') // 10000 - 7800
    expect(leaderInsight!.surferId).toBe('s1')
  })

  it('identifies cutline gap', () => {
    const surfers: Surfer[] = [
      makeSurfer('s1', 'Leader'),
      makeSurfer('s2', 'Second'),
      makeSurfer('s3', 'AtCutline'),
      makeSurfer('s4', 'BelowCutline'),
    ]

    const results: EventResult[] = [
      makeResult('s1', 'e1', 10000),
      makeResult('s2', 'e1', 7800),
      makeResult('s3', 'e1', 6085),
      makeResult('s4', 'e1', 4745),
    ]

    const season = makeSeason({ completedEvents: 1, cutoffRank: 3 })
    const rankings = calculateRanking(surfers, results, season)

    const insights = getQuickInsights(rankings, season)

    const cutlineInsight = insights.find((i) => i.type === 'cutline')
    expect(cutlineInsight).toBeDefined()
    expect(cutlineInsight!.message).toContain('AtCutline')
    expect(cutlineInsight!.message).toContain('BelowCutline')
    // Gap: 6085 - 4745 = 1340
    expect(cutlineInsight!.message).toContain('1,340')
  })

  it('reports eliminated surfers when present', () => {
    const rankings: RankedSurfer[] = [
      {
        surfer: makeSurfer('s1', 'A'),
        rank: 1,
        totalPoints: 90000,
        countedResults: [],
        discardedResults: [],
        status: 'locked',
        positionChange: 0,
      },
      {
        surfer: makeSurfer('s2', 'B'),
        rank: 2,
        totalPoints: 5000,
        countedResults: [],
        discardedResults: [],
        status: 'eliminated',
        positionChange: 0,
      },
      {
        surfer: makeSurfer('s3', 'C'),
        rank: 3,
        totalPoints: 3000,
        countedResults: [],
        discardedResults: [],
        status: 'eliminated',
        positionChange: 0,
      },
    ]

    const season = makeSeason()
    const insights = getQuickInsights(rankings, season)

    const eliminatedInsight = insights.find((i) => i.type === 'eliminated')
    expect(eliminatedInsight).toBeDefined()
    expect(eliminatedInsight!.message).toContain('2')
    expect(eliminatedInsight!.message).toContain('surfers')
  })

  it('reports clinched surfers when present', () => {
    const rankings: RankedSurfer[] = [
      {
        surfer: makeSurfer('s1', 'A'),
        rank: 1,
        totalPoints: 90000,
        countedResults: [],
        discardedResults: [],
        status: 'locked',
        positionChange: 0,
      },
      {
        surfer: makeSurfer('s2', 'B'),
        rank: 2,
        totalPoints: 80000,
        countedResults: [],
        discardedResults: [],
        status: 'classified',
        positionChange: 0,
      },
    ]

    const season = makeSeason()
    const insights = getQuickInsights(rankings, season)

    const clinchedInsight = insights.find((i) => i.type === 'clinched')
    expect(clinchedInsight).toBeDefined()
    expect(clinchedInsight!.message).toContain('2')
    expect(clinchedInsight!.message).toContain('clinched')
  })

  it('returns empty eliminated/clinched when none exist', () => {
    const rankings: RankedSurfer[] = [
      {
        surfer: makeSurfer('s1', 'A'),
        rank: 1,
        totalPoints: 10000,
        countedResults: [],
        discardedResults: [],
        status: 'risk',
        positionChange: 0,
      },
    ]

    const season = makeSeason()
    const insights = getQuickInsights(rankings, season)

    expect(insights.find((i) => i.type === 'eliminated')).toBeUndefined()
    expect(insights.find((i) => i.type === 'clinched')).toBeUndefined()
  })
})
