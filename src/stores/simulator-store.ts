import { create } from 'zustand'
import type { Placement, SimulationResult } from '@/engine/types'
import { simulateScenario } from '@/engine/simulator'
import { getStatus } from '@/engine/elimination'
import { useRankingStore } from './ranking-store'

interface HypotheticalResult {
  eventId: string
  surferId: string
  placement: Placement
}

interface SimulatorStore {
  hypotheticals: HypotheticalResult[]
  simulationResult: SimulationResult | null
  setPlacement: (eventId: string, surferId: string, placement: Placement | null) => void
  runSimulation: () => void
  clearSimulation: () => void
}

export const useSimulatorStore = create<SimulatorStore>()((set, get) => ({
  hypotheticals: [],
  simulationResult: null,

  setPlacement: (eventId, surferId, placement) => {
    set((state) => {
      const others = state.hypotheticals.filter(
        (h) => !(h.eventId === eventId && h.surferId === surferId),
      )
      if (placement === null) return { hypotheticals: others }
      return { hypotheticals: [...others, { eventId, surferId, placement }] }
    })
  },

  runSimulation: () => {
    const { hypotheticals } = get()
    if (hypotheticals.length === 0) {
      set({ simulationResult: null })
      return
    }

    const { surfers, results, season, events, rankings } = useRankingStore.getState()

    const result = simulateScenario(
      surfers,
      results,
      { hypotheticalResults: hypotheticals },
      season,
    )

    // Enrich simulation rankings with status
    const enriched = result.rankings.map((r) => ({
      ...r,
      status: getStatus(r.surfer, r.rank, result.rankings.flatMap((x) => x.countedResults), result.rankings, season, events),
    }))

    // Compute changes against current rankings
    const changes = rankings.map((before) => {
      const after = enriched.find((r) => r.surfer.id === before.surfer.id)
      return {
        surferId: before.surfer.id,
        rankBefore: before.rank,
        rankAfter: after?.rank ?? before.rank,
        pointsBefore: before.totalPoints,
        pointsAfter: after?.totalPoints ?? before.totalPoints,
      }
    }).filter((c) => c.rankBefore !== c.rankAfter)

    set({ simulationResult: { rankings: enriched, changes } })
  },

  clearSimulation: () => set({ hypotheticals: [], simulationResult: null }),
}))
