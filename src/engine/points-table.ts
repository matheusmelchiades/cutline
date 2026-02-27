import type { Placement } from './types'

export const PIPELINE_MULTIPLIER = 1.5

/** Official WSL CT points table (standard event) */
export const POINTS_TABLE: Record<Placement, number> = {
  1: 10000,
  2: 7800,
  3: 6085,
  5: 4745,
  9: 3320,
  13: 2590,
  17: 2020,
  25: 1575,
  33: 1330,
}

/** All valid placements sorted from best (1st) to worst (33rd) */
export const PLACEMENTS: Placement[] = [1, 2, 3, 5, 9, 13, 17, 25, 33]

/**
 * Returns the points for a given placement.
 * If isPipeline is true, applies the 1.5x multiplier.
 */
export function getPoints(placement: Placement, isPipeline: boolean): number {
  const base = POINTS_TABLE[placement]
  return isPipeline ? Math.round(base * PIPELINE_MULTIPLIER) : base
}

/** Maximum points possible in a single event */
export function getMaxEventPoints(isPipeline: boolean): number {
  return getPoints(1, isPipeline)
}

/** Minimum points for participating (worst placement = 33rd) */
export function getMinEventPoints(isPipeline: boolean): number {
  return getPoints(33, isPipeline)
}
