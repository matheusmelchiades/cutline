import type { Surfer, EventResult, Season, RankedSurfer } from './types'

/**
 * Applies the discard rule: keeps the N best results, discards the rest.
 * Surfers who didn't participate in an event simply don't have that event
 * in their results list — it's NOT treated as 0 for discard purposes.
 */
export function applyDiscards(
  results: EventResult[],
  bestN: number,
): { counted: EventResult[]; discarded: EventResult[] } {
  if (results.length <= bestN) {
    return { counted: [...results], discarded: [] }
  }

  const sorted = [...results].sort((a, b) => b.points - a.points)
  return {
    counted: sorted.slice(0, bestN),
    discarded: sorted.slice(bestN),
  }
}

/**
 * Sums the points of counted results.
 */
export function calculateTotalPoints(counted: EventResult[]): number {
  return counted.reduce((sum, r) => sum + r.points, 0)
}

/**
 * WSL tiebreaker: compare surfers by their best individual result,
 * then second best, then third, etc.
 * Returns negative if a should rank higher (better) than b.
 */
function tiebreakerCompare(a: RankedSurfer, b: RankedSurfer): number {
  const aResults = [...a.countedResults].sort((x, y) => y.points - x.points)
  const bResults = [...b.countedResults].sort((x, y) => y.points - x.points)

  const maxLen = Math.max(aResults.length, bResults.length)
  for (let i = 0; i < maxLen; i++) {
    const aPoints = aResults[i]?.points ?? 0
    const bPoints = bResults[i]?.points ?? 0
    if (aPoints !== bPoints) {
      return bPoints - aPoints // higher points = better rank (lower number)
    }
  }

  return 0 // truly identical
}

/**
 * Sorts surfers by totalPoints descending, with WSL tiebreaker.
 * Assigns rank numbers (1-based).
 */
export function sortWithTiebreaker(surfers: RankedSurfer[]): RankedSurfer[] {
  const sorted = [...surfers].sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) {
      return b.totalPoints - a.totalPoints
    }
    return tiebreakerCompare(a, b)
  })

  return sorted.map((s, i) => ({ ...s, rank: i + 1 }))
}

/**
 * Main ranking function: calculates the full ranking with discards applied.
 * Uses bestOfForTitle for the general ranking.
 */
export function calculateRanking(
  surfers: Surfer[],
  results: EventResult[],
  season: Season,
): RankedSurfer[] {
  const resultsBySurfer = new Map<string, EventResult[]>()
  for (const surfer of surfers) {
    resultsBySurfer.set(surfer.id, [])
  }
  for (const result of results) {
    const existing = resultsBySurfer.get(result.surferId)
    if (existing) {
      existing.push(result)
    }
  }

  const rankedSurfers: RankedSurfer[] = surfers.map((surfer) => {
    const surferResults = resultsBySurfer.get(surfer.id) ?? []
    const { counted, discarded } = applyDiscards(
      surferResults,
      season.bestOfForTitle,
    )
    const totalPoints = calculateTotalPoints(counted)

    return {
      surfer,
      rank: 0, // will be assigned by sortWithTiebreaker
      totalPoints,
      countedResults: counted,
      discardedResults: discarded,
      status: 'risk' as const, // default, will be updated by elimination logic
      positionChange: 0,
    }
  })

  return sortWithTiebreaker(rankedSurfers)
}
