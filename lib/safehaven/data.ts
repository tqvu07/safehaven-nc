// Static UI reference data for the intake form (locations, structure types,
// storm scenario presets). All risk/shelter data now comes live from the
// SafeHaven NC FastAPI backend — see lib/safehaven/api.ts.

export type CountyId = 'orange' | 'durham' | 'wake' | 'mecklenburg' | 'buncombe' | 'new-hanover' | 'guilford'

export interface DemoLocation {
  id: string
  label: string
  coords: [number, number]
  county: CountyId
}

export const NC_BOUNDS: [[number, number], [number, number]] = [
  [33.84, -84.32],
  [36.59, -75.46],
]

export const DEMO_LOCATIONS: DemoLocation[] = [
  { id: 'chapel-hill', label: 'Chapel Hill (Orange Co)', coords: [35.9132, -79.0558], county: 'orange' },
  { id: 'raleigh', label: 'Downtown Raleigh (Wake Co)', coords: [35.7796, -78.6382], county: 'wake' },
  { id: 'charlotte', label: 'Charlotte (Mecklenburg Co)', coords: [35.2271, -80.8431], county: 'mecklenburg' },
  { id: 'asheville', label: 'Asheville (Buncombe Co)', coords: [35.5951, -82.5515], county: 'buncombe' },
  { id: 'wilmington', label: 'Wilmington (New Hanover Co)', coords: [34.2104, -77.8868], county: 'new-hanover' },
  { id: 'greensboro', label: 'Greensboro (Guilford Co)', coords: [36.0726, -79.7922], county: 'guilford' },
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
