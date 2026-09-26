// Static UI reference data for the intake form (locations, structure types,
// storm scenario presets). All risk/shelter data now comes live from the
// SafeHaven NC FastAPI backend — see lib/safehaven/api.ts.

export type CountyId = 'orange' | 'durham' | 'wake'

export interface DemoLocation {
  id: string
  label: string
  coords: [number, number]
  county: CountyId
}

export const DEMO_LOCATIONS: DemoLocation[] = [
  { id: 'chapel-hill', label: 'Chapel Hill (Orange Co)', coords: [35.9132, -79.0558], county: 'orange' },
  { id: 'durham', label: 'Downtown Durham (Durham Co)', coords: [35.994, -78.8986], county: 'durham' },
  { id: 'raleigh', label: 'Downtown Raleigh (Wake Co)', coords: [35.7796, -78.6382], county: 'wake' },
  { id: 'cary', label: 'Cary Town Center (Wake Co)', coords: [35.7915, -78.7811], county: 'wake' },
]

// Matches the backend's `structure_type` enum exactly.
export type StructureType = 'single_family' | 'multi_family' | 'mobile_home'

export const STRUCTURE_TYPES: { id: StructureType; label: string }[] = [
  { id: 'single_family', label: 'Single Family Home' },
  { id: 'multi_family', label: 'Multi-Family / Apartment' },
  { id: 'mobile_home', label: 'Manufactured / Mobile Home' },
]

export interface StormScenario {
  id: string
  label: string
  shortLabel: string
  /** Sent to the backend as `scenario_wind_mph` when this preset is selected. */
  windMph: number
}

export const STORM_SCENARIOS: StormScenario[] = [
  { id: 'ts', label: 'Tropical Storm', shortLabel: '50 mph', windMph: 50 },
  { id: 'cat1', label: 'Cat 1 Hurricane', shortLabel: '80 mph', windMph: 80 },
  { id: 'cat2', label: 'Cat 2 Hurricane', shortLabel: '105 mph', windMph: 105 },
  { id: 'ef2', label: 'Severe Tornado', shortLabel: 'EF2 · 125 mph', windMph: 125 },
]

export const HIGH_CAPACITY_THRESHOLD = 1000
