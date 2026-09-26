'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, LoaderCircle } from 'lucide-react'
import { DEMO_LOCATIONS, STORM_SCENARIOS } from '@/lib/safehaven/data'
import { evaluateRisk, ApiError, type ApiEvaluation, type EvaluateRequestBody } from '@/lib/safehaven/api'
import { IntakeForm, type IntakeState } from './intake-form'
import { Verdict } from './verdict'
import { HomeDetails } from './home-details'
import { ShelterPanel } from './shelter-panel'

const DEFAULT_INTAKE: IntakeState = {
  coords: DEMO_LOCATIONS[0].coords,
  locationLabel: DEMO_LOCATIONS[0].label,
  structureType: 'single_family',
  yearBuilt: 1996,
  mode: 'scenario',
  scenarioId: 'cat2',
}

function scenarioWindMph(id: string): number {
  const s = STORM_SCENARIOS.find((x) => x.id === id) ?? STORM_SCENARIOS[0]
  return s.windMph
}

function buildRequestBody(intake: IntakeState): EvaluateRequestBody {
  return {
    lat: intake.coords[0],
    lon: intake.coords[1],
    year_built: Number.isFinite(intake.yearBuilt) ? intake.yearBuilt : 1996,
    structure_type: intake.structureType,
    // null tells the backend to pull the live 72-hour Open-Meteo forecast instead.
    scenario_wind_mph: intake.mode === 'live' ? null : scenarioWindMph(intake.scenarioId),
  }
}

export function Dashboard() {
  const [intake, setIntake] = useState<IntakeState>(DEFAULT_INTAKE)
  const [evaluatedIntake, setEvaluatedIntake] = useState<IntakeState | null>(null)
  const [evaluation, setEvaluation] = useState<ApiEvaluation | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    const snapshot = intake
    try {
      const result = await evaluateRisk(buildRequestBody(snapshot))
      setEvaluation(result)
      setEvaluatedIntake(snapshot)
      setSelectedId(null)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Something went wrong while checking your home. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Run an initial evaluation on load so the dashboard isn't empty.
  useEffect(() => {
    handleSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stale = evaluatedIntake !== null && JSON.stringify(intake) !== JSON.stringify(evaluatedIntake)

  return (
    <div className="mx-auto max-w-6xl py-2 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
      <div className="flex flex-col gap-2 sm:gap-6 lg:flex-row lg:items-start">
        <aside className="lg:sticky lg:top-20 lg:w-80 lg:shrink-0">
          <IntakeForm value={intake} onChange={setIntake} onSubmit={handleSubmit} submitting={submitting} stale={stale} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-6" aria-busy={submitting} aria-live="polite">
          {error && (
            <p
              role="alert"
              className="flex items-center gap-2 border-y border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive sm:rounded-lg sm:border"
            >
              <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}

          {submitting && !evaluation && (
            <div
              role="status"
              className="flex flex-col items-center justify-center gap-2 border-y border-border bg-card px-4 py-14 text-center text-sm text-muted-foreground sm:rounded-xl sm:border"
            >
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
              <span>Checking your home…</span>
              <span className="text-xs">First request can take up to 30s while the server wakes up.</span>
            </div>
          )}

          {evaluation && evaluatedIntake && (
            <>
              <Verdict evaluation={evaluation} />
              <ShelterPanel evaluation={evaluation} userCoords={evaluatedIntake.coords} selectedId={selectedId} onSelect={setSelectedId} />
              <HomeDetails evaluation={evaluation} intake={evaluatedIntake} />
            </>
          )}

          <p className="px-4 py-4 text-xs leading-relaxed text-muted-foreground sm:px-0 sm:py-0">
            Estimates use live FEMA BCAT and forecast data for Orange, Durham, and Wake counties. Always follow
            official instructions from ReadyNC and your local emergency management office.
          </p>
        </div>
      </div>
    </div>
  )
}
