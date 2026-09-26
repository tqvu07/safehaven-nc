'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import { DEMO_LOCATIONS, STORM_SCENARIOS } from '@/lib/safehaven/data'
import { evaluate, fetchLiveHazard, type Evaluation, type Hazard } from '@/lib/safehaven/risk'
import { IntakeForm, type IntakeState } from './intake-form'
import { Verdict } from './verdict'
import { HomeDetails } from './home-details'
import { ShelterPanel } from './shelter-panel'

const DEFAULT_INTAKE: IntakeState = {
  coords: DEMO_LOCATIONS[0].coords,
  locationLabel: DEMO_LOCATIONS[0].label,
  structureType: 'single-family',
  yearBuilt: 1996,
  mode: 'scenario',
  scenarioId: 'cat2',
}

function scenarioHazard(id: string): Hazard {
  const s = STORM_SCENARIOS.find((x) => x.id === id) ?? STORM_SCENARIOS[0]
  return { source: 'scenario', label: s.label, windMph: s.windMph, rainIn: s.rainIn, kind: s.kind }
}

function runEvaluation(intake: IntakeState, hazard: Hazard) {
  return evaluate({
    coords: intake.coords,
    structureType: intake.structureType,
    yearBuilt: Number.isFinite(intake.yearBuilt) ? intake.yearBuilt : 1996,
    hazard,
  })
}

export function Dashboard() {
  const [intake, setIntake] = useState<IntakeState>(DEFAULT_INTAKE)
  const [evaluatedIntake, setEvaluatedIntake] = useState<IntakeState>(DEFAULT_INTAKE)
  const [evaluation, setEvaluation] = useState<Evaluation>(() =>
    runEvaluation(DEFAULT_INTAKE, scenarioHazard(DEFAULT_INTAKE.scenarioId)),
  )
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSubmit = async () => {
    setSubmitting(true)
    setNotice(null)
    const snapshot = intake
    let hazard: Hazard
    if (snapshot.mode === 'live') {
      try {
        hazard = await fetchLiveHazard(snapshot.coords)
      } catch {
        hazard = { ...scenarioHazard('ts'), label: 'Tropical Storm (fallback)' }
        setNotice('We couldn’t load the live forecast, so we used a tropical storm instead.')
      }
    } else {
      hazard = scenarioHazard(snapshot.scenarioId)
    }
    setEvaluation(runEvaluation(snapshot, hazard))
    setEvaluatedIntake(snapshot)
    setSelectedId(null)
    setSubmitting(false)
  }

  const stale = JSON.stringify(intake) !== JSON.stringify(evaluatedIntake)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="lg:sticky lg:top-20 lg:w-80 lg:shrink-0">
          <IntakeForm value={intake} onChange={setIntake} onSubmit={handleSubmit} submitting={submitting} stale={stale} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6" aria-busy={submitting} aria-live="polite">
          {notice && (
            <p role="status" className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-sm">
              <Info className="size-4 shrink-0 text-warning" aria-hidden="true" />
              {notice}
            </p>
          )}
          <Verdict evaluation={evaluation} />
          <ShelterPanel evaluation={evaluation} selectedId={selectedId} onSelect={setSelectedId} />
          <HomeDetails evaluation={evaluation} />
          <p className="text-xs leading-relaxed text-muted-foreground">
            This is an estimate using sample data for Orange, Durham, and Wake counties. Always follow official
            instructions from ReadyNC and your local emergency management office.
          </p>
        </div>
      </div>
    </div>
  )
}
