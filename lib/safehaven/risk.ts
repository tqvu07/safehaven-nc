import {
  COUNTIES,
  SHELTERS,
  type County,
  type CountyId,
  type HazardKind,
  type Shelter,
  type StructureType,
} from './data'

export interface Hazard {
  source: 'live' | 'scenario'
  label: string
  windMph: number
  rainIn: number
  kind: HazardKind
}

export interface EvaluationInput {
  coords: [number, number]
  structureType: StructureType
  yearBuilt: number
  hazard: Hazard
}

export interface RankedShelter extends Shelter {
  distanceMi: number
  travelMin: number
}

export interface Evaluation {
  input: EvaluationInput
  county: County
  legacyCode: boolean
  homeWindRatingMph: number
  vulnerability: number
  estimatedDamage: number
  homeValue: number
  unsafe: boolean
  survivingShelters: RankedShelter[]
  filteredOutCount: number
}

const EARTH_RADIUS_MI = 3958.8

export function haversineMi([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_MI * Math.asin(Math.sqrt(a))
}

export function detectCounty(coords: [number, number]): CountyId {
  let best: CountyId = 'wake'
  let bestDist = Infinity
  for (const county of Object.values(COUNTIES)) {
    const d = haversineMi(coords, county.centroid)
    if (d < bestDist) {
      bestDist = d
      best = county.id
    }
  }
  return best
}

/** Approximate 3-second-gust capacity of the building envelope by type and code era. */
export function homeWindRating(type: StructureType, yearBuilt: number, county: County) {
  let rating: number
  if (type === 'manufactured') {
    rating = yearBuilt >= 1994 ? 70 : yearBuilt >= 1976 ? 60 : 50
  } else {
    const modern = yearBuilt >= 2000
    const base = type === 'multi-family' ? 5 : 0
    rating = (modern ? county.designWindMph : 90) + base
    if (yearBuilt >= 2012) rating += 5
  }
  if (county.bcat.wind === 'Not Resistant') rating -= 5
  return rating
}

const HOME_VALUE_SCALE: Record<StructureType, number> = {
  'single-family': 1,
  'multi-family': 0.6,
  manufactured: 0.22,
}

export function evaluate(input: EvaluationInput): Evaluation {
  const county = COUNTIES[detectCounty(input.coords)]
  const legacyCode = input.yearBuilt < 2000
  const rating = homeWindRating(input.structureType, input.yearBuilt, county)

  const ratio = input.hazard.windMph / rating
  let vulnerability = (100 * ratio ** 4) / (1 + ratio ** 4)
  if (input.hazard.kind === 'tornado' && county.bcat.tornado === 'Not Resistant') vulnerability += 8
  if (input.hazard.rainIn >= 8 && county.bcat.flood === 'Not Resistant') vulnerability += 5
  vulnerability = Math.round(Math.min(99, Math.max(1, vulnerability)))

  const homeValue = Math.round(county.medianHomeValue * HOME_VALUE_SCALE[input.structureType])
  const damageRatio = (vulnerability / 100) ** 1.6
  const estimatedDamage = Math.round((homeValue * damageRatio * county.noaaLossFactor) / 100) * 100

  const unsafe = vulnerability >= 50 || input.hazard.windMph > rating

  const surviving = SHELTERS.filter((s) => s.windRatingMph >= input.hazard.windMph)
  const survivingShelters = surviving
    .map((s) => {
      const distanceMi = haversineMi(input.coords, s.coords)
      const roadMi = distanceMi * 1.3
      return { ...s, distanceMi, travelMin: Math.max(3, Math.round((roadMi / 28) * 60)) }
    })
    .sort((a, b) => a.distanceMi - b.distanceMi)

  return {
    input,
    county,
    legacyCode,
    homeWindRatingMph: rating,
    vulnerability,
    estimatedDamage,
    homeValue,
    unsafe,
    survivingShelters,
    filteredOutCount: SHELTERS.length - surviving.length,
  }
}

export function directionsUrl(origin: [number, number], dest: [number, number]) {
  const params = new URLSearchParams({
    api: '1',
    origin: origin.join(','),
    destination: dest.join(','),
    travelmode: 'driving',
  })
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

export async function fetchLiveHazard(coords: [number, number]): Promise<Hazard> {
  const params = new URLSearchParams({
    latitude: coords[0].toFixed(4),
    longitude: coords[1].toFixed(4),
    hourly: 'wind_gusts_10m,precipitation',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    forecast_days: '3',
    timezone: 'America/New_York',
  })
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
  if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`)
  const data = (await res.json()) as {
    hourly: { wind_gusts_10m: (number | null)[]; precipitation: (number | null)[] }
  }
  const gusts = data.hourly.wind_gusts_10m.filter((v): v is number => v != null)
  const rain = data.hourly.precipitation.filter((v): v is number => v != null)
  return {
    source: 'live',
    label: 'Live 72-hr Forecast',
    windMph: Math.round(Math.max(0, ...gusts)),
    rainIn: Math.round(rain.reduce((a, b) => a + b, 0) * 10) / 10,
    kind: 'live',
  }
}

export const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
