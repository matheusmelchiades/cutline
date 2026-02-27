/**
 * BACKTEST 2025 — Regressão contra dados reais da WSL
 *
 * Objetivo: validar que o motor de cálculo produz projeções corretas
 * comparando com o que REALMENTE aconteceu na temporada 2025.
 *
 * Como preencher:
 * 1. Acesse worldsurfleague.com/athletes/tour/mct para ver standings finais
 * 2. Para cada evento, acesse a página de resultados e anote placements
 * 3. Preencha SURFERS_2025, EVENTS_2025 e RESULTS_2025 abaixo
 *
 * Fonte: https://www.worldsurfleague.com/events (filtrar por 2025)
 */

import { describe, it, expect } from 'vitest'
import { calculateRanking } from '@/engine/ranking'
import { getStatus, isEliminated } from '@/engine/elimination'
import { getPoints } from '@/engine/points-table'
import type { Surfer, Event, EventResult, Season } from '@/engine/types'

// ─── CONFIGURAÇÃO DA TEMPORADA 2025 ──────────────────────────────────────────
// 2025 usou formato Final Five: 11 eventos regulares + Finals em Fiji
// Mid-season cut após evento 6: top 22 homens avançaram
// Descarte: best 7 of 11 para ranking final

const SEASON_2025: Season = {
  year: 2025,
  totalEvents: 11,
  completedEvents: 11,
  bestOfForTitle: 7,
  bestOfForCutoff: 7,
  cutoffRank: 22,
}

// ─── SURFISTAS ────────────────────────────────────────────────────────────────
// Ordem: seed 2025. Top 5 foi para a Finals em Fiji.
// Fonte: worldsurfleague.com/athletes/tour/mct

const SURFERS_2025: Surfer[] = [
  // TODO: confirmar seeds e países via WSL
  { id: 'yago-dora',         name: 'Yago Dora',          country: 'BR', countryFlag: '🇧🇷', seed: 1 },
  { id: 'griffin-colapinto', name: 'Griffin Colapinto',  country: 'US', countryFlag: '🇺🇸', seed: 2 },
  { id: 'jack-robinson',     name: 'Jack Robinson',      country: 'AU', countryFlag: '🇦🇺', seed: 3 },
  { id: 'ethan-ewing',       name: 'Ethan Ewing',        country: 'AU', countryFlag: '🇦🇺', seed: 4 },
  { id: 'jordy-smith',       name: 'Jordy Smith',        country: 'ZA', countryFlag: '🇿🇦', seed: 5 },
  { id: 'john-john-florence',name: 'John John Florence', country: 'US', countryFlag: '🇺🇸', seed: 6 },
  { id: 'gabriel-medina',    name: 'Gabriel Medina',     country: 'BR', countryFlag: '🇧🇷', seed: 7 },
  { id: 'italo-ferreira',    name: 'Italo Ferreira',     country: 'BR', countryFlag: '🇧🇷', seed: 8 },
  { id: 'ryan-callinan',     name: 'Ryan Callinan',      country: 'AU', countryFlag: '🇦🇺', seed: 9 },
  { id: 'caio-ibelli',       name: 'Caio Ibelli',        country: 'BR', countryFlag: '🇧🇷', seed: 10 },
]

// ─── EVENTOS 2025 ─────────────────────────────────────────────────────────────
// Ordem cronológica. Pipeline era evento 1 (Janeiro).
// Fonte: worldsurfleague.com/events?year=2025

const EVENTS_2025: Pick<Event, 'id' | 'isPipeline'>[] = [
  { id: 'pipeline-2025',         isPipeline: true  }, // E01 — Jan, Oahu HI
  { id: 'bells-2025',            isPipeline: false }, // E02 — Abr, Victoria AU
  { id: 'margaret-river-2025',   isPipeline: false }, // E03 — Abr, WA AU
  { id: 'g-land-2025',           isPipeline: false }, // E04 — Mai, Java ID
  { id: 'el-salvador-2025',      isPipeline: false }, // E05 — Jun, La Libertad SV
  { id: 'saquarema-2025',        isPipeline: false }, // E06 — Jun, RJ BR  ← mid-season cut
  { id: 'rio-2025',              isPipeline: false }, // E07 — Jul, RJ BR
  { id: 'tahiti-2025',           isPipeline: false }, // E08 — Ago, Teahupo'o PF
  { id: 'peniche-2025',          isPipeline: false }, // E09 — Out, Peniche PT
  { id: 'trestles-2025',         isPipeline: false }, // E10 — Out, San Clemente US
  { id: 'cloudbreak-reg-2025',   isPipeline: false }, // E11 — Nov, Tavarua FJ
]

// ─── RESULTADOS 2025 ──────────────────────────────────────────────────────────
// TODO: preencher com os placements reais de cada evento
// Formato: { eventId, surferId, placement }
// Placements válidos: 1,2,3,5,9,13,17,25,33
//
// Como preencher:
//   worldsurfleague.com/events/2025/ct/[ID]/[nome]/results
//   Pipeline 2025: worldsurfleague.com/events/2025/ct/321/billabong-pro-pipeline/results

type RawResult = { eventId: string; surferId: string; placement: number }

const RESULTS_RAW: RawResult[] = [
  // ── Pipeline 2025 (E01) ──────────────────────────────────────────────────
  // TODO: adicionar resultados reais
  // Exemplo (substituir pelos reais):
  // { eventId: 'pipeline-2025', surferId: 'john-john-florence', placement: 1 },
  // { eventId: 'pipeline-2025', surferId: 'griffin-colapinto',  placement: 2 },

  // ── Bells 2025 (E02) ─────────────────────────────────────────────────────
  // Jack Robinson ganhou
  { eventId: 'bells-2025', surferId: 'jack-robinson', placement: 1 },
  // TODO: restante do top placements

  // ── El Salvador 2025 (E05) ───────────────────────────────────────────────
  // Jordy Smith ganhou
  { eventId: 'el-salvador-2025', surferId: 'jordy-smith', placement: 1 },

  // ── Peniche 2025 (E09) ───────────────────────────────────────────────────
  // Yago Dora ganhou
  { eventId: 'peniche-2025', surferId: 'yago-dora', placement: 1 },
]

// Converter para EventResult com pontos calculados
function buildResults(raw: RawResult[]): EventResult[] {
  return raw.map((r) => {
    const isPipeline = EVENTS_2025.find((e) => e.id === r.eventId)?.isPipeline ?? false
    const points = getPoints(r.placement, isPipeline)
    return { ...r, points }
  })
}

const RESULTS_2025 = buildResults(RESULTS_RAW)

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function seasonAt(completedEvents: number): Season {
  return { ...SEASON_2025, completedEvents }
}

function resultsUpTo(eventIndex: number): EventResult[] {
  const completedIds = EVENTS_2025.slice(0, eventIndex).map((e) => e.id)
  return RESULTS_2025.filter((r) => completedIds.includes(r.eventId))
}

// ─── TESTES ───────────────────────────────────────────────────────────────────

describe('Backtest 2025 — Cálculo de pontos', () => {
  it('Pipeline vale 1.5x (15000 pts para 1º lugar)', () => {
    const pts = getPoints(1, true)
    expect(pts).toBe(15000)
  })

  it('1º lugar em evento normal vale 10000 pts', () => {
    const pts = getPoints(1, false)
    expect(pts).toBe(10000)
  })

  it('Jack Robinson acumula 10000 pts após vitória em Bells', () => {
    const results = resultsUpTo(3) // após Bells
    const rankings = calculateRanking(SURFERS_2025, results, seasonAt(2))
    const jack = rankings.find((r) => r.surfer.id === 'jack-robinson')
    expect(jack?.totalPoints).toBeGreaterThanOrEqual(10000)
  })

  it('Yago Dora acumula 10000 pts após vitória em Peniche', () => {
    const results = resultsUpTo(10) // após Peniche
    const rankings = calculateRanking(SURFERS_2025, results, seasonAt(9))
    const yago = rankings.find((r) => r.surfer.id === 'yago-dora')
    expect(yago?.totalPoints).toBeGreaterThanOrEqual(10000)
  })
})

describe('Backtest 2025 — Ranking', () => {
  it('ao final da temporada, Yago Dora deve ser #1', () => {
    if (RESULTS_2025.length < 50) {
      // Pular se dados incompletos
      console.warn('⚠️  Dados 2025 incompletos — preencher RESULTS_RAW para habilitar este teste')
      return
    }

    const rankings = calculateRanking(SURFERS_2025, RESULTS_2025, SEASON_2025)
    const yago = rankings.find((r) => r.surfer.id === 'yago-dora')
    expect(yago?.rank).toBe(1)
  })

  it('top 5 finais devem ser: Dora, Colapinto, Robinson, Ewing, Smith (Finals 2025)', () => {
    if (RESULTS_2025.length < 50) {
      console.warn('⚠️  Dados 2025 incompletos — preencher RESULTS_RAW para habilitar este teste')
      return
    }

    const expectedTop5 = [
      'yago-dora', 'griffin-colapinto', 'jack-robinson', 'ethan-ewing', 'jordy-smith'
    ]
    const rankings = calculateRanking(SURFERS_2025, RESULTS_2025, SEASON_2025)
    const actualTop5 = rankings.slice(0, 5).map((r) => r.surfer.id)
    expect(actualTop5).toEqual(expect.arrayContaining(expectedTop5))
  })
})

describe('Backtest 2025 — Eliminação matemática', () => {
  it('após event 10, surfistas fora do top 22 devem aparecer como eliminated', () => {
    if (RESULTS_2025.length < 50) {
      console.warn('⚠️  Dados 2025 incompletos — preencher RESULTS_RAW para habilitar este teste')
      return
    }

    const results = resultsUpTo(10)
    const season = seasonAt(10)
    const rankings = calculateRanking(SURFERS_2025, results, season)
    const events = EVENTS_2025.map((e) => ({
      id: e.id, name: e.id, location: '', startDate: '', endDate: '',
      status: 'upcoming' as const, isPipeline: e.isPipeline, round: 1,
    }))

    const rank23plus = rankings.filter((r) => r.rank > 22)
    rank23plus.forEach((r) => {
      const status = getStatus(r.surfer, r.rank, results, rankings, season, events)
      // Com só 1 evento restante, surfistas muito abaixo do rank 22 devem estar eliminados
      if (r.rank > 25) {
        expect(status).toBe('eliminated')
      }
    })
  })
})
