import type {
  Surfer,
  EventResult,
  SimulationInput,
  SimulationResult,
  RankedSurfer,
  Season,
} from './types'
import { getPoints } from './points-table'
import { calculateRanking } from './ranking'

/**
 * Simulates a scenario by adding hypothetical results to the current results
 * and recalculating the full ranking.
 */
export function simulateScenario(
  surfers: Surfer[],
  currentResults: EventResult[],
  hypothetical: SimulationInput,
  season: Season,
  events?: Array<{ id: string; isPipeline: boolean }>,
): SimulationResult {
  // Build a lookup of events by id for Pipeline multiplier
  const eventMap = new Map(events?.map((e) => [e.id, e]) ?? [])

  // Convert hypothetical inputs to EventResult objects
  const hypotheticalResults: EventResult[] =
    hypothetical.hypotheticalResults.map((h) => {
      const event = eventMap.get(h.eventId)
      const isPipeline = event?.isPipeline ?? false
      return {
        surferId: h.surferId,
        eventId: h.eventId,
        placement: h.placement,
        points: getPoints(h.placement, isPipeline),
      }
    })

  // Merge current and hypothetical results
  const mergedResults = [...currentResults, ...hypotheticalResults]

  // Adjust season to reflect hypothetical completed events
  const hypotheticalEventIds = new Set(
    hypothetical.hypotheticalResults.map((h) => h.eventId),
  )
  const additionalCompleted = hypotheticalEventIds.size
  const adjustedSeason: Season = {
    ...season,
    completedEvents: season.completedEvents + additionalCompleted,
  }

  // Calculate ranking before (current state)
  const rankingsBefore = calculateRanking(surfers, currentResults, season)

  // Calculate ranking after (with hypothetical results)
  const rankingsAfter = calculateRanking(
    surfers,
    mergedResults,
    adjustedSeason,
  )

  // Compare the two rankings
  const changes = compareRankings(rankingsBefore, rankingsAfter)

  return {
    rankings: rankingsAfter,
    changes,
  }
}

/**
 * Compares two ranking snapshots and returns the changes.
 */
export function compareRankings(
  before: RankedSurfer[],
  after: RankedSurfer[],
): SimulationResult['changes'] {
  const beforeMap = new Map(before.map((rs) => [rs.surfer.id, rs]))

  return after
    .map((afterSurfer) => {
      const beforeSurfer = beforeMap.get(afterSurfer.surfer.id)
      if (!beforeSurfer) return null

      return {
        surferId: afterSurfer.surfer.id,
        rankBefore: beforeSurfer.rank,
        rankAfter: afterSurfer.rank,
        pointsBefore: beforeSurfer.totalPoints,
        pointsAfter: afterSurfer.totalPoints,
      }
    })
    .filter(
      (
        c,
      ): c is {
        surferId: string
        rankBefore: number
        rankAfter: number
        pointsBefore: number
        pointsAfter: number
      } => c !== null,
    )
}
