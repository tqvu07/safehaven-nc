import type { StructureType } from './data'

/** Base URL of the SafeHaven NC FastAPI backend (hosted on Render). */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://safehaven-nc-api.onrender.com'

// Render free-tier instances can cold-start in ~20-30s, so we give the
// request plenty of room before giving up.
const REQUEST_TIMEOUT_MS = 45_000

export interface EvaluateRequestBody {
  lat: number
  lon: number
  year_built: number
  structure_type: StructureType
  scenario_wind_mph: number | null
}

export interface ApiWeather {
  current_temp_f: number | null
  wind_speed_mph: number | null
  wind_gusts_mph: number | null
  precipitation_next_24h_in: number | null
}

export interface DataSources {
  county?: string | null
  building_codes?: string | null
  shelter_occupancy?: string | null
}

export interface ShelterResult {
  name: string
  county: string
  max_wind_rating_mph: number
  capacity: number
  total_population?: number | null
  evacuation_capacity?: number | null
  remaining_capacity?: number | null
  shelter_status?: string | null
  pet_friendly: boolean
  ada_accessible: boolean
  generator: boolean
  distance_miles: number
  lat: number
  lon: number
  navigation_url: string
}

export interface EvaluateResponse {
  county_name: string
  county_fips: string
  bcat_wind_resistance: string
  bcat_flood_resistance: string
  building_code_era: string
  storm_wind_mph: number
  vulnerability_score: number
  predicted_damage_usd: number
  recommendation: string
  weather?: ApiWeather | null
  data_sources?: DataSources | null
  survivable_shelters: ShelterResult[]
}

export type ApiShelter = ShelterResult
export type ApiEvaluation = EvaluateResponse

export class ApiError extends Error {}

/** POSTs an evaluation request to the live backend and returns the parsed result. */
export async function evaluateRisk(body: EvaluateRequestBody): Promise<ApiEvaluation> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}/api/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(
        'The server is taking too long to respond. It may still be waking up from sleep — please try again in a moment.',
      )
    }
    throw new ApiError('Could not reach the SafeHaven NC server. Check your connection and try again.')
  } finally {
    clearTimeout(timeout)
  }

  if (!res.ok) {
    let detail = ''
    try {
      const errorBody = (await res.json()) as { detail?: unknown }
      detail = typeof errorBody?.detail === 'string' ? errorBody.detail : ''
    } catch {
      // response body wasn't JSON — fall back to the generic message below
    }
    throw new ApiError(detail || `The server returned an error (${res.status}). Please try again.`)
  }

  try {
    return (await res.json()) as ApiEvaluation
  } catch {
    throw new ApiError('Received an unreadable response from the server. Please try again.')
  }
}
