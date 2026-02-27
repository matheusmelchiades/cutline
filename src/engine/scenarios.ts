import type {
  Surfer,
  EventResult,
  Season,
  RankedSurfer,
  Placement,
  QuickInsight,
} from './types'
import { PLACEMENTS, getPoints } from './points-table'
import { applyDiscards, calculateTotalPoints, calculateRanking } from './ranking'
import { bestPossibleScore, worstGuaranteedScore } from './elimination'

/**
 * Returns a descriptive string of the minimum the surfer needs to achieve
 * to reach the target rank. Mathematically correct but not exhaustive.
 *
 * Example outputs:
 * - "Needs at least Equal 5th in remaining 3 events"
 * - "Already qualified"
 * - "Mathematically eliminated"
 */
export function whatNeedsToHappen(
  targetSurfer: Surfer,
  targetRank: number,
  currentResults: EventResult[],
  allSurfers: Surfer[],
  season: Season,
): string {
  const rankings = calculateRanking(allSurfers, currentResults, season)

  const surferRanked = rankings.find(
    (rs) => rs.surfer.id === targetSurfer.id,
  )
  if (!surferRanked) return 'Surfer not found in rankings'

  // Already at or above target rank
  if (surferRanked.rank <= targetRank) {
    // Check if locked (worst case still holds the rank)
    const worst = worstGuaranteedScore(surferRanked, season)
    const targetPositionSurfer = rankings.find(
      (rs) => rs.rank === targetRank,
    )
    if (targetPositionSurfer) {
      const targetWorst = worstGuaranteedScore(targetPositionSurfer, season)
      if (worst >= targetWorst) {
        return 'Already qualified'
      }
    }
    return `Currently at rank ${surferRanked.rank}, but position is not yet secure`
  }

  const remainingEvents = season.totalEvents - season.completedEvents
  if (remainingEvents === 0) {
    return 'Season is over — mathematically eliminated'
  }

  // Check if mathematically eliminated
  const best = bestPossibleScore(targetSurfer, currentResults, season)
  const targetPositionSurfer = rankings.find(
    (rs) => rs.rank === targetRank,
  )
  if (targetPositionSurfer) {
    const targetWorst = worstGuaranteedScore(targetPositionSurfer, season)
    if (best < targetWorst) {
      return 'Mathematically eliminated'
    }
  }

  // Find the minimum consistent placement needed across remaining events
  const surferResults = currentResults.filter(
    (r) => r.surferId === targetSurfer.id,
  )

  // Try each placement from best to worst, find the minimum needed
  for (const placement of PLACEMENTS) {
    const hypothetical: EventResult[] = []
    for (let i = 0; i < remainingEvents; i++) {
      const isLastEvent = season.completedEvents + i + 1 === season.totalEvents
      hypothetical.push({
        surferId: targetSurfer.id,
        eventId: `scenario-${i}`,
        placement,
        points: getPoints(placement, isLastEvent),
      })
    }

    const allResults = [...surferResults, ...hypothetical]
    const { counted } = applyDiscards(allResults, season.bestOfForTitle)
    const totalPoints = calculateTotalPoints(counted)

    // Would this be enough to reach the target rank?
    // Compare against the worst guaranteed of the surfer currently at targetRank
    if (targetPositionSurfer) {
      const targetWorst = worstGuaranteedScore(targetPositionSurfer, season)
      if (totalPoints >= targetWorst) {
        const placementLabel = getPlacementLabel(placement)
        if (remainingEvents === 1) {
          return `Needs at least ${placementLabel} in the final event`
        }
        return `Needs at least ${placementLabel} in remaining ${remainingEvents} events`
      }
    }
  }

  return 'Needs exceptional results across all remaining events'
}

function getPlacementLabel(placement: Placement): string {
  switch (placement) {
    case 1:
      return '1st'
    case 2:
      return '2nd'
    case 3:
      return 'Equal 3rd'
    case 5:
      return 'Equal 5th'
    case 9:
      return 'Equal 9th'
    case 13:
      return 'Equal 13th'
    case 17:
      return 'Equal 17th'
    case 25:
      return 'Equal 25th'
    case 33:
      return 'Equal 33rd'
  }
}

/**
 * Generates automatic insights for the sidebar/dashboard.
 */
export function getQuickInsights(
  rankings: RankedSurfer[],
  season: Season,
): QuickInsight[] {
  const insights: QuickInsight[] = []

  // Leader insight
  const leader = rankings[0]
  if (leader) {
    const margin =
      rankings.length > 1
        ? leader.totalPoints - rankings[1].totalPoints
        : leader.totalPoints
    insights.push({
      type: 'leader',
      message: `${leader.surfer.name} leads by ${margin.toLocaleString()} pts`,
      surferId: leader.surfer.id,
    })
  }

  // Cutline insight — who is at the cutoff position
  const cutoffRank = season.cutoffRank
  const atCutline = rankings.find((rs) => rs.rank === cutoffRank)
  const justBelow = rankings.find((rs) => rs.rank === cutoffRank + 1)

  if (atCutline && justBelow) {
    const gap = atCutline.totalPoints - justBelow.totalPoints
    insights.push({
      type: 'cutline',
      message: `Cutline gap: ${gap.toLocaleString()} pts between #${cutoffRank} ${atCutline.surfer.name} and #${cutoffRank + 1} ${justBelow.surfer.name}`,
      surferId: atCutline.surfer.id,
    })
  }

  // Eliminated surfers
  const eliminated = rankings.filter((rs) => rs.status === 'eliminated')
  if (eliminated.length > 0) {
    insights.push({
      type: 'eliminated',
      message: `${eliminated.length} surfer${eliminated.length > 1 ? 's' : ''} mathematically eliminated`,
    })
  }

  // Clinched (locked/classified) surfers
  const clinched = rankings.filter(
    (rs) => rs.status === 'locked' || rs.status === 'classified',
  )
  if (clinched.length > 0) {
    insights.push({
      type: 'clinched',
      message: `${clinched.length} surfer${clinched.length > 1 ? 's' : ''} clinched post-season spot`,
    })
  }

  return insights
}
