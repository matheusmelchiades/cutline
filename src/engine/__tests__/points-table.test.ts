import { describe, it, expect } from 'vitest'
import {
  getPoints,
  POINTS_TABLE,
  PIPELINE_MULTIPLIER,
  PLACEMENTS,
  getMaxEventPoints,
  getMinEventPoints,
} from '@/engine/points-table'
import type { Placement } from '@/engine/types'

describe('POINTS_TABLE', () => {
  it('has entries for all 9 placements', () => {
    expect(Object.keys(POINTS_TABLE)).toHaveLength(9)
  })

  it('has correct values for all placements', () => {
    expect(POINTS_TABLE[1]).toBe(10000)
    expect(POINTS_TABLE[2]).toBe(7800)
    expect(POINTS_TABLE[3]).toBe(6085)
    expect(POINTS_TABLE[5]).toBe(4745)
    expect(POINTS_TABLE[9]).toBe(3320)
    expect(POINTS_TABLE[13]).toBe(2590)
    expect(POINTS_TABLE[17]).toBe(2020)
    expect(POINTS_TABLE[25]).toBe(1575)
    expect(POINTS_TABLE[33]).toBe(1330)
  })

  it('values are in descending order by placement', () => {
    for (let i = 0; i < PLACEMENTS.length - 1; i++) {
      expect(POINTS_TABLE[PLACEMENTS[i]]).toBeGreaterThan(
        POINTS_TABLE[PLACEMENTS[i + 1]],
      )
    }
  })
})

describe('PIPELINE_MULTIPLIER', () => {
  it('equals 1.5', () => {
    expect(PIPELINE_MULTIPLIER).toBe(1.5)
  })
})

describe('getPoints', () => {
  it('returns 10000 for 1st place in normal event', () => {
    expect(getPoints(1, false)).toBe(10000)
  })

  it('returns 15000 for 1st place in Pipeline', () => {
    expect(getPoints(1, true)).toBe(15000)
  })

  it('returns correct Pipeline points for all placements', () => {
    const expected: Record<Placement, number> = {
      1: 15000,
      2: 11700,
      3: 9128, // 6085 * 1.5 = 9127.5, rounded to 9128
      5: 7118, // 4745 * 1.5 = 7117.5, rounded to 7118
      9: 4980,
      13: 3885,
      17: 3030,
      25: 2363, // 1575 * 1.5 = 2362.5, rounded to 2363
      33: 1995,
    }

    for (const placement of PLACEMENTS) {
      expect(getPoints(placement, true)).toBe(expected[placement])
    }
  })

  it('returns correct normal points for all placements', () => {
    for (const placement of PLACEMENTS) {
      expect(getPoints(placement, false)).toBe(POINTS_TABLE[placement])
    }
  })
})

describe('getMaxEventPoints', () => {
  it('returns 10000 for normal event', () => {
    expect(getMaxEventPoints(false)).toBe(10000)
  })

  it('returns 15000 for Pipeline', () => {
    expect(getMaxEventPoints(true)).toBe(15000)
  })
})

describe('getMinEventPoints', () => {
  it('returns 1330 for normal event', () => {
    expect(getMinEventPoints(false)).toBe(1330)
  })

  it('returns 1995 for Pipeline', () => {
    expect(getMinEventPoints(true)).toBe(1995)
  })
})
