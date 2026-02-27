export type Placement = 1 | 2 | 3 | 5 | 9 | 13 | 17 | 25 | 33
export type SurferStatus = 'classified' | 'risk' | 'eliminated' | 'locked'

export interface MockSurfer {
  id: string
  name: string
  country: string
  countryFlag: string
  seed: number
}

export interface MockRankedSurfer {
  surfer: MockSurfer
  rank: number
  totalPoints: number
  status: SurferStatus
  positionChange: number
}

export interface MockEvent {
  id: string
  name: string
  location: string
  country: string
  startDate: string
  endDate: string
  status: 'completed' | 'live' | 'upcoming' | 'cancelled'
  isPipeline: boolean
  round: number
}

export const MOCK_RANKINGS: MockRankedSurfer[] = [
  { surfer: { id: 'john-john-florence', name: 'John John Florence', country: 'US', countryFlag: '\u{1F1FA}\u{1F1F8}', seed: 1 }, rank: 1, totalPoints: 15000, status: 'classified', positionChange: 0 },
  { surfer: { id: 'gabriel-medina', name: 'Gabriel Medina', country: 'BR', countryFlag: '\u{1F1E7}\u{1F1F7}', seed: 2 }, rank: 2, totalPoints: 11700, status: 'classified', positionChange: 2 },
  { surfer: { id: 'griffin-colapinto', name: 'Griffin Colapinto', country: 'US', countryFlag: '\u{1F1FA}\u{1F1F8}', seed: 3 }, rank: 3, totalPoints: 9128, status: 'classified', positionChange: -1 },
  { surfer: { id: 'filipe-toledo', name: 'Filipe Toledo', country: 'BR', countryFlag: '\u{1F1E7}\u{1F1F7}', seed: 4 }, rank: 4, totalPoints: 9128, status: 'classified', positionChange: 1 },
  { surfer: { id: 'jack-robinson', name: 'Jack Robinson', country: 'AU', countryFlag: '\u{1F1E6}\u{1F1FA}', seed: 5 }, rank: 5, totalPoints: 7118, status: 'classified', positionChange: 0 },
  { surfer: { id: 'ethan-ewing', name: 'Ethan Ewing', country: 'AU', countryFlag: '\u{1F1E6}\u{1F1FA}', seed: 6 }, rank: 6, totalPoints: 7118, status: 'risk', positionChange: -2 },
  { surfer: { id: 'italo-ferreira', name: 'Italo Ferreira', country: 'BR', countryFlag: '\u{1F1E7}\u{1F1F7}', seed: 7 }, rank: 7, totalPoints: 4980, status: 'risk', positionChange: 0 },
  { surfer: { id: 'kanoa-igarashi', name: 'Kanoa Igarashi', country: 'JP', countryFlag: '\u{1F1EF}\u{1F1F5}', seed: 8 }, rank: 8, totalPoints: 4980, status: 'risk', positionChange: 3 },
  { surfer: { id: 'caio-ibelli', name: 'Caio Ibelli', country: 'BR', countryFlag: '\u{1F1E7}\u{1F1F7}', seed: 9 }, rank: 9, totalPoints: 3885, status: 'risk', positionChange: -1 },
  { surfer: { id: 'cole-houshmand', name: 'Cole Houshmand', country: 'US', countryFlag: '\u{1F1FA}\u{1F1F8}', seed: 10 }, rank: 10, totalPoints: 3885, status: 'risk', positionChange: 0 },
  { surfer: { id: 'jordy-smith', name: 'Jordy Smith', country: 'ZA', countryFlag: '\u{1F1FF}\u{1F1E6}', seed: 11 }, rank: 11, totalPoints: 3320, status: 'risk', positionChange: 2 },
  { surfer: { id: 'liam-obrien', name: "Liam O'Brien", country: 'AU', countryFlag: '\u{1F1E6}\u{1F1FA}', seed: 12 }, rank: 12, totalPoints: 3320, status: 'risk', positionChange: 0 },
  { surfer: { id: 'ryan-callinan', name: 'Ryan Callinan', country: 'AU', countryFlag: '\u{1F1E6}\u{1F1FA}', seed: 13 }, rank: 13, totalPoints: 3320, status: 'risk', positionChange: 1 },
  { surfer: { id: 'ian-gouveia', name: 'Ian Gouveia', country: 'BR', countryFlag: '\u{1F1E7}\u{1F1F7}', seed: 14 }, rank: 14, totalPoints: 2590, status: 'risk', positionChange: -1 },
  { surfer: { id: 'barron-mamiya', name: 'Barron Mamiya', country: 'US', countryFlag: '\u{1F1FA}\u{1F1F8}', seed: 15 }, rank: 15, totalPoints: 2590, status: 'risk', positionChange: 0 },
  { surfer: { id: 'seth-moniz', name: 'Seth Moniz', country: 'US', countryFlag: '\u{1F1FA}\u{1F1F8}', seed: 16 }, rank: 16, totalPoints: 2020, status: 'risk', positionChange: 2 },
  { surfer: { id: 'yago-dora', name: 'Yago Dora', country: 'BR', countryFlag: '\u{1F1E7}\u{1F1F7}', seed: 17 }, rank: 17, totalPoints: 2020, status: 'risk', positionChange: -1 },
  { surfer: { id: 'joao-chianca', name: 'Joao Chianca', country: 'BR', countryFlag: '\u{1F1E7}\u{1F1F7}', seed: 18 }, rank: 18, totalPoints: 2020, status: 'risk', positionChange: 0 },
  { surfer: { id: 'samuel-pupo', name: 'Samuel Pupo', country: 'BR', countryFlag: '\u{1F1E7}\u{1F1F7}', seed: 19 }, rank: 19, totalPoints: 1575, status: 'risk', positionChange: 1 },
  { surfer: { id: 'jackson-baker', name: 'Jackson Baker', country: 'AU', countryFlag: '\u{1F1E6}\u{1F1FA}', seed: 20 }, rank: 20, totalPoints: 1575, status: 'risk', positionChange: 0 },
  { surfer: { id: 'matthew-mcgillivary', name: 'Matthew McGillivary', country: 'ZA', countryFlag: '\u{1F1FF}\u{1F1E6}', seed: 21 }, rank: 21, totalPoints: 1575, status: 'risk', positionChange: -2 },
  { surfer: { id: 'miguel-pupo', name: 'Miguel Pupo', country: 'BR', countryFlag: '\u{1F1E7}\u{1F1F7}', seed: 22 }, rank: 22, totalPoints: 1330, status: 'risk', positionChange: 1 },
  { surfer: { id: 'connor-oleary', name: "Connor O'Leary", country: 'AU', countryFlag: '\u{1F1E6}\u{1F1FA}', seed: 23 }, rank: 23, totalPoints: 1330, status: 'risk', positionChange: 0 },
  { surfer: { id: 'deivid-silva', name: 'Deivid Silva', country: 'BR', countryFlag: '\u{1F1E7}\u{1F1F7}', seed: 24 }, rank: 24, totalPoints: 1330, status: 'risk', positionChange: -1 },
  { surfer: { id: 'frederico-morais', name: 'Frederico Morais', country: 'PT', countryFlag: '\u{1F1F5}\u{1F1F9}', seed: 25 }, rank: 25, totalPoints: 1330, status: 'eliminated', positionChange: -1 },
  { surfer: { id: 'reef-heazlewood', name: 'Reef Heazlewood', country: 'AU', countryFlag: '\u{1F1E6}\u{1F1FA}', seed: 26 }, rank: 26, totalPoints: 1330, status: 'eliminated', positionChange: 0 },
]

export const MOCK_EVENTS: MockEvent[] = [
  { id: 'pipe-masters-2026', name: 'Billabong Pro Pipeline', location: 'Pipeline, North Shore', country: 'US', startDate: '2026-01-29', endDate: '2026-02-10', status: 'completed', isPipeline: false, round: 1 },
  { id: 'margaret-river-2026', name: 'Western Australia Pro', location: 'Margaret River', country: 'AU', startDate: '2026-04-01', endDate: '2026-04-11', status: 'upcoming', isPipeline: false, round: 2 },
  { id: 'bells-beach-2026', name: 'Rip Curl Pro Bells Beach', location: 'Bells Beach', country: 'AU', startDate: '2026-04-14', endDate: '2026-04-24', status: 'upcoming', isPipeline: false, round: 3 },
  { id: 'surf-ranch-2026', name: 'Surf Ranch Pro', location: 'Lemoore, California', country: 'US', startDate: '2026-05-01', endDate: '2026-05-03', status: 'upcoming', isPipeline: false, round: 4 },
  { id: 'rio-pro-2026', name: 'Oi Rio Pro', location: 'Saquarema, Rio de Janeiro', country: 'BR', startDate: '2026-06-01', endDate: '2026-06-10', status: 'upcoming', isPipeline: false, round: 5 },
  { id: 'el-salvador-2026', name: 'Corona El Salvador Pro', location: 'El Salvador', country: 'SV', startDate: '2026-06-15', endDate: '2026-06-22', status: 'upcoming', isPipeline: false, round: 6 },
  { id: 'jbay-2026', name: 'Corona Open J-Bay', location: "Jeffreys Bay", country: 'ZA', startDate: '2026-07-01', endDate: '2026-07-12', status: 'upcoming', isPipeline: false, round: 7 },
  { id: 'tahiti-2026', name: 'Shiseido Tahiti Pro', location: "Teahupo'o, Tahiti", country: 'PF', startDate: '2026-08-01', endDate: '2026-08-12', status: 'upcoming', isPipeline: false, round: 8 },
  { id: 'france-2026', name: 'Quiksilver Pro France', location: 'Hossegor, France', country: 'FR', startDate: '2026-09-01', endDate: '2026-09-11', status: 'upcoming', isPipeline: false, round: 9 },
  { id: 'abu-dhabi-2026', name: 'Abu Dhabi Pro', location: 'Abu Dhabi', country: 'AE', startDate: '2026-10-01', endDate: '2026-10-10', status: 'upcoming', isPipeline: false, round: 10 },
  { id: 'portugal-2026', name: 'MEO Rip Curl Pro Portugal', location: 'Peniche, Portugal', country: 'PT', startDate: '2026-10-15', endDate: '2026-10-25', status: 'upcoming', isPipeline: false, round: 11 },
  { id: 'pipe-finale-2026', name: 'Pipe Masters Finale', location: 'Pipeline, North Shore', country: 'US', startDate: '2026-12-08', endDate: '2026-12-20', status: 'upcoming', isPipeline: true, round: 12 },
]
