export type CountyId = 'orange' | 'durham' | 'wake'

export type ResistanceStatus = 'Resistant' | 'Not Resistant'

export interface County {
  id: CountyId
  name: string
  fips: string
  centroid: [number, number]
  bcat: {
    wind: ResistanceStatus
    flood: ResistanceStatus
    tornado: ResistanceStatus
  }
  designWindMph: number
  /** NOAA Storm Events (2000–2026) property-loss calibration multiplier */
  noaaLossFactor: number
  noaaEventCount: number
  medianHomeValue: number
}

export const COUNTIES: Record<CountyId, County> = {
  orange: {
    id: 'orange',
    name: 'Orange County',
    fips: '37135',
    centroid: [36.06, -79.12],
    bcat: { wind: 'Not Resistant', flood: 'Resistant', tornado: 'Not Resistant' },
    designWindMph: 115,
    noaaLossFactor: 0.94,
    noaaEventCount: 212,
    medianHomeValue: 452000,
  },
  durham: {
    id: 'durham',
    name: 'Durham County',
    fips: '37063',
    centroid: [36.03, -78.88],
    bcat: { wind: 'Resistant', flood: 'Not Resistant', tornado: 'Not Resistant' },
    designWindMph: 115,
    noaaLossFactor: 1.02,
    noaaEventCount: 268,
    medianHomeValue: 368000,
  },
  wake: {
    id: 'wake',
    name: 'Wake County',
    fips: '37183',
    centroid: [35.79, -78.65],
    bcat: { wind: 'Resistant', flood: 'Resistant', tornado: 'Not Resistant' },
    designWindMph: 115,
    noaaLossFactor: 1.08,
    noaaEventCount: 391,
    medianHomeValue: 441000,
  },
}

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

export type StructureType = 'single-family' | 'multi-family' | 'manufactured'

export const STRUCTURE_TYPES: { id: StructureType; label: string }[] = [
  { id: 'single-family', label: 'Single Family Home' },
  { id: 'multi-family', label: 'Multi-Family / Apartment' },
  { id: 'manufactured', label: 'Manufactured / Mobile Home' },
]

export type HazardKind = 'tropical' | 'hurricane' | 'tornado' | 'live'

export interface StormScenario {
  id: string
  label: string
  shortLabel: string
  windMph: number
  rainIn: number
  kind: HazardKind
}

export const STORM_SCENARIOS: StormScenario[] = [
  { id: 'ts', label: 'Tropical Storm', shortLabel: '50 mph', windMph: 50, rainIn: 6.5, kind: 'tropical' },
  { id: 'cat1', label: 'Cat 1 Hurricane', shortLabel: '80 mph', windMph: 80, rainIn: 8, kind: 'hurricane' },
  { id: 'cat2', label: 'Cat 2 Hurricane', shortLabel: '105 mph', windMph: 105, rainIn: 10, kind: 'hurricane' },
  { id: 'ef2', label: 'Severe Tornado', shortLabel: 'EF2 · 125 mph', windMph: 125, rainIn: 2, kind: 'tornado' },
]

export interface Shelter {
  id: string
  name: string
  address: string
  county: CountyId
  coords: [number, number]
  windRatingMph: number
  construction: string
  capacity: number
  petFriendly: boolean
  ada: boolean
  generator: boolean
}

export const SHELTERS: Shelter[] = [
  {
    id: 'dean-smith',
    name: 'Dean E. Smith Center',
    address: '300 Skipper Bowles Dr, Chapel Hill, NC 27514',
    county: 'orange',
    coords: [35.8998, -79.0438],
    windRatingMph: 150,
    construction: 'IBC-Rated Steel Frame',
    capacity: 2400,
    petFriendly: false,
    ada: true,
    generator: true,
  },
  {
    id: 'chapel-hill-hs',
    name: 'Chapel Hill High School',
    address: '1709 High School Rd, Chapel Hill, NC 27516',
    county: 'orange',
    coords: [35.9496, -79.0648],
    windRatingMph: 130,
    construction: 'Reinforced Masonry (IBC 2012)',
    capacity: 650,
    petFriendly: true,
    ada: true,
    generator: true,
  },
  {
    id: 'smith-ms',
    name: 'Smith Middle School',
    address: '9201 Seawell School Rd, Chapel Hill, NC 27516',
    county: 'orange',
    coords: [35.9395, -79.0725],
    windRatingMph: 115,
    construction: 'Concrete Block / Steel Joist',
    capacity: 420,
    petFriendly: false,
    ada: true,
    generator: false,
  },
  {
    id: 'ch-community-center',
    name: 'Chapel Hill Community Center',
    address: '120 S Estes Dr, Chapel Hill, NC 27514',
    county: 'orange',
    coords: [35.9322, -79.0391],
    windRatingMph: 100,
    construction: 'Wood Truss / Masonry Veneer',
    capacity: 220,
    petFriendly: true,
    ada: true,
    generator: false,
  },
  {
    id: 'cedar-ridge-hs',
    name: 'Cedar Ridge High School',
    address: '1125 New Grady Brown School Rd, Hillsborough, NC 27278',
    county: 'orange',
    coords: [36.0542, -79.1003],
    windRatingMph: 140,
    construction: 'Reinforced Masonry (IBC 2015)',
    capacity: 800,
    petFriendly: true,
    ada: true,
    generator: true,
  },
  {
    id: 'durham-human-services',
    name: 'Durham County Human Services Complex',
    address: '414 E Main St, Durham, NC 27701',
    county: 'durham',
    coords: [35.9929, -78.8966],
    windRatingMph: 130,
    construction: 'Cast-in-Place Concrete Frame',
    capacity: 900,
    petFriendly: false,
    ada: true,
    generator: true,
  },
  {
    id: 'durham-convention',
    name: 'Durham Convention Center',
    address: '301 W Morgan St, Durham, NC 27701',
    county: 'durham',
    coords: [35.996, -78.9031],
    windRatingMph: 145,
    construction: 'IBC-Rated Steel Frame',
    capacity: 1800,
    petFriendly: false,
    ada: true,
    generator: true,
  },
  {
    id: 'hillside-hs',
    name: 'Hillside High School',
    address: '3727 Fayetteville St, Durham, NC 27707',
    county: 'durham',
    coords: [35.9504, -78.9003],
    windRatingMph: 140,
    construction: 'Reinforced Masonry (IBC 2009)',
    capacity: 750,
    petFriendly: true,
    ada: true,
    generator: true,
  },
  {
    id: 'riverside-hs',
    name: 'Riverside High School',
    address: '3218 Rose of Sharon Rd, Durham, NC 27712',
    county: 'durham',
    coords: [36.0496, -78.9185],
    windRatingMph: 115,
    construction: 'Concrete Block / Steel Joist',
    capacity: 600,
    petFriendly: true,
    ada: true,
    generator: false,
  },
  {
    id: 'durham-safe-room',
    name: 'Durham County Community Safe Room',
    address: '2422 Broad St, Durham, NC 27704',
    county: 'durham',
    coords: [36.0271, -78.9086],
    windRatingMph: 250,
    construction: 'FEMA P-361 / ICC 500 Safe Room',
    capacity: 300,
    petFriendly: false,
    ada: true,
    generator: true,
  },
  {
    id: 'raleigh-convention',
    name: 'Raleigh Convention Center',
    address: '500 S Salisbury St, Raleigh, NC 27601',
    county: 'wake',
    coords: [35.7743, -78.64],
    windRatingMph: 150,
    construction: 'IBC-Rated Steel Frame',
    capacity: 3000,
    petFriendly: false,
    ada: true,
    generator: true,
  },
  {
    id: 'pnc-arena',
    name: 'PNC Arena',
    address: '1400 Edwards Mill Rd, Raleigh, NC 27607',
    county: 'wake',
    coords: [35.8033, -78.722],
    windRatingMph: 140,
    construction: 'IBC-Rated Steel Frame',
    capacity: 5000,
    petFriendly: true,
    ada: true,
    generator: true,
  },
  {
    id: 'broughton-hs',
    name: 'Broughton High School',
    address: "723 St Mary's St, Raleigh, NC 27605",
    county: 'wake',
    coords: [35.7922, -78.6536],
    windRatingMph: 110,
    construction: 'Legacy Masonry (Retrofitted)',
    capacity: 500,
    petFriendly: false,
    ada: true,
    generator: false,
  },
  {
    id: 'enloe-hs',
    name: 'Enloe High School',
    address: '128 Clarendon Crescent, Raleigh, NC 27610',
    county: 'wake',
    coords: [35.781, -78.6173],
    windRatingMph: 125,
    construction: 'Reinforced Masonry (IBC 2006)',
    capacity: 700,
    petFriendly: true,
    ada: true,
    generator: true,
  },
  {
    id: 'wake-safe-room',
    name: 'Wake County Community Safe Room',
    address: '4011 Carya Dr, Raleigh, NC 27610',
    county: 'wake',
    coords: [35.7524, -78.6004],
    windRatingMph: 250,
    construction: 'FEMA P-361 / ICC 500 Safe Room',
    capacity: 400,
    petFriendly: true,
    ada: true,
    generator: true,
  },
  {
    id: 'athens-drive-hs',
    name: 'Athens Drive High School',
    address: '1420 Athens Dr, Raleigh, NC 27606',
    county: 'wake',
    coords: [35.7547, -78.711],
    windRatingMph: 140,
    construction: 'Reinforced Masonry (IBC 2015)',
    capacity: 850,
    petFriendly: true,
    ada: true,
    generator: true,
  },
  {
    id: 'green-hope-hs',
    name: 'Green Hope High School',
    address: '2500 Carpenter Upchurch Rd, Cary, NC 27519',
    county: 'wake',
    coords: [35.8154, -78.8763],
    windRatingMph: 130,
    construction: 'Reinforced Masonry (IBC 2012)',
    capacity: 900,
    petFriendly: true,
    ada: true,
    generator: true,
  },
  {
    id: 'cary-hs',
    name: 'Cary High School',
    address: '638 Walnut St, Cary, NC 27511',
    county: 'wake',
    coords: [35.7753, -78.789],
    windRatingMph: 120,
    construction: 'Concrete Block / Steel Joist',
    capacity: 650,
    petFriendly: false,
    ada: true,
    generator: true,
  },
  {
    id: 'herbert-young',
    name: 'Herbert C. Young Community Center',
    address: '101 Wilkinson Ave, Cary, NC 27513',
    county: 'wake',
    coords: [35.7866, -78.7853],
    windRatingMph: 95,
    construction: 'Wood Truss / Masonry Veneer',
    capacity: 180,
    petFriendly: true,
    ada: true,
    generator: false,
  },
]

export const HIGH_CAPACITY_THRESHOLD = 1000
