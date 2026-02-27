import type {
  Surfer,
  EventResult,
  RankedSurfer,
  Season,
  SurferStatus,
} from './types'
import { getMaxEventPoints, getMinEventPoints } from './points-table'
import { applyDiscards, calculateTotalPoints } from './ranking'

/**
 * Calculates the best possible score for a surfer.
 * Assumes the surfer wins every remaining event (including Pipeline if applicable).
 * Then applies the discard rule (bestOfForTitle) to keep only the N best.
 *
 * For simplicity, we assume:
 * - All remaining events are standard (10k for 1st) EXCEPT the last event (round 12 = Pipeline)
 * - If Pipeline is among remaining events, its max is 15k
 */
export function bestPossibleScore(
  surfer: Surfer,
  currentResults: EventResult[],
  season: Season,
  events?: Array<{ id: string; isPipeline: boolean }>,
): number {
  const surferResults = currentResults.filter(
    (r) => r.surferId === surfer.id,
  )

  const remainingEvents = season.totalEvents - season.completedEvents

  // Build hypothetical best results for remaining events
  const hypotheticalBest: EventResult[] = []

  if (events) {
    // Use actual event info to determine Pipeline status
    const completedEventIds = new Set(surferResults.map((r) => r.eventId))
    const upcoming = events.filter((e) => !completedEventIds.has(e.id))

    for (const event of upcoming) {
      hypotheticalBest.push({
        surferId: surfer.id,
        eventId: event.id,
        placement: 1,
        points: getMaxEventPoints(event.isPipeline),
      })
    }
  } else {
    // Fallback: assume last event is Pipeline if it hasn't been played yet
    for (let i = 0; i < remainingEvents; i++) {
      const isLastEvent = season.completedEvents + i + 1 === season.totalEvents
      hypotheticalBest.push({
        surferId: surfer.id,
        eventId: `hypothetical-${i}`,
        placement: 1,
        points: getMaxEventPoints(isLastEvent),
      })
    }
  }

  const allResults = [...surferResults, ...hypotheticalBest]
  const { counted } = applyDiscards(allResults, season.bestOfForTitle)
  return calculateTotalPoints(counted)
}

/**
 * Calculates the worst guaranteed score for a ranked surfer.
 * Assumes the surfer gets the worst possible result (Equal 33rd) in all
 * remaining events, then applies the discard rule keeping the best N.
 *
 * This represents the minimum points the surfer is guaranteed to have,
 * even if they perform terribly in all remaining events.
 */
export function worstGuaranteedScore(
  rankedSurfer: RankedSurfer,
  season: Season,
  events?: Array<{ id: string; isPipeline: boolean }>,
): number {
  const allCurrentResults = [
    ...rankedSurfer.countedResults,
    ...rankedSurfer.discardedResults,
  ]

  const remainingEvents = season.totalEvents - season.completedEvents

  // Build hypothetical worst results for remaining events
  const hypotheticalWorst: EventResult[] = []

  if (events) {
    const completedEventIds = new Set(
      allCurrentResults.map((r) => r.eventId),
    )
    const upcoming = events.filter((e) => !completedEventIds.has(e.id))

    for (const event of upcoming) {
      hypotheticalWorst.push({
        surferId: rankedSurfer.surfer.id,
        eventId: event.id,
        placement: 33,
        points: getMinEventPoints(event.isPipeline),
      })
    }
  } else {
    for (let i = 0; i < remainingEvents; i++) {
      const isLastEvent = season.completedEvents + i + 1 === season.totalEvents
      hypotheticalWorst.push({
        surferId: rankedSurfer.surfer.id,
        eventId: `hypothetical-worst-${i}`,
        placement: 33,
        points: getMinEventPoints(isLastEvent),
      })
    }
  }

  const allResults = [...allCurrentResults, ...hypotheticalWorst]
  const { counted } = applyDiscards(allResults, season.bestOfForTitle)
  return calculateTotalPoints(counted)
}

/**
 * Checks if a surfer is mathematically eliminated from a target position.
 * Returns true if the surfer's best possible score is less than the
 * target surfer's worst guaranteed score.
 */
export function isEliminated(
  surfer: Surfer,
  currentResults: EventResult[],
  targetRankedSurfer: RankedSurfer,
  season: Season,
  events?: Array<{ id: string; isPipeline: boolean }>,
): boolean {
  const best = bestPossibleScore(surfer, currentResults, season, events)
  const worst = worstGuaranteedScore(targetRankedSurfer, season, events)
  return best < worst
}

/**
 * Determines the classification status of a surfer:
 *
 * - 'locked': impossible to be overtaken (bestPossible of everyone below < worstGuaranteed of this surfer)
 * - 'classified': rank <= cutoffRank AND mathematically guaranteed
 *    (worstCase of this surfer >= worstCase of the surfer at #cutoffRank)
 * - 'eliminated': mathematically eliminated from top cutoffRank
 * - 'risk': any other case
 */
export function getStatus(
  surfer: Surfer,
  rank: number,
  currentResults: EventResult[],
  allRankedSurfers: RankedSurfer[],
  season: Season,
  events?: Array<{ id: string; isPipeline: boolean }>,
): SurferStatus {
  const cutoffRank = season.cutoffRank

  // Find this surfer's ranked entry
  const thisRanked = allRankedSurfers.find(
    (rs) => rs.surfer.id === surfer.id,
  )
  if (!thisRanked) return 'risk'

  const thisWorst = worstGuaranteedScore(thisRanked, season, events)

  // Check if locked: no surfer ranked below can possibly reach this surfer's worst guaranteed
  const surfersBelow = allRankedSurfers.filter((rs) => rs.rank > rank)
  const isLocked = surfersBelow.every((rs) => {
    const theirBest = bestPossibleScore(
      rs.surfer,
      currentResults,
      season,
      events,
    )
    return theirBest < thisWorst
  })

  if (isLocked && rank <= cutoffRank) {
    return 'locked'
  }

  // Check if classified: rank <= cutoffRank AND mathematically guaranteed
  if (rank <= cutoffRank) {
    // Find the surfer at cutoff position
    const cutoffSurfer = allRankedSurfers.find(
      (rs) => rs.rank === cutoffRank,
    )
    if (cutoffSurfer) {
      const cutoffWorst = worstGuaranteedScore(cutoffSurfer, season, events)
      if (thisWorst >= cutoffWorst) {
        // Even in worst case, this surfer stays at or above the cutoff
        // Also verify that no one below cutoff can overtake
        const belowCutoff = allRankedSurfers.filter(
          (rs) => rs.rank > cutoffRank,
        )
        const safeFromBelow = belowCutoff.every((rs) => {
          const theirBest = bestPossibleScore(
            rs.surfer,
            currentResults,
            season,
            events,
          )
          return theirBest < thisWorst
        })
        if (safeFromBelow) {
          return 'classified'
        }
      }
    }
  }

  // Check if eliminated: can't possibly reach top cutoffRank
  // The surfer at cutoffRank position — check if our best < their worst
  const cutoffSurfer = allRankedSurfers.find(
    (rs) => rs.rank === cutoffRank,
  )
  if (cutoffSurfer && rank > cutoffRank) {
    const eliminated = isEliminated(
      surfer,
      currentResults,
      cutoffSurfer,
      season,
      events,
    )
    if (eliminated) {
      return 'eliminated'
    }
  }

  return 'risk'
}
