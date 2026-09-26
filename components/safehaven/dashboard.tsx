'use client'

import { useState } from 'react'
import { Building, Map as MapIcon, TriangleAlert } from 'lucide-react'
import { DEMO_LOCATIONS, STORM_SCENARIOS } from '@/lib/safehaven/data'
import { evaluate, fetchLiveHazard, type Evaluation, type Hazard } from '@/lib/safehaven/risk'
import { IntakeForm, type IntakeState } from './intake-form'
import { CodeScorecard } from './code-scorecard'
import { VulnerabilityCard } from './vulnerability-card'
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
        hazard = { ...scenarioHazard('ts'), label: 'Fallback (Tropical Storm)' }
        setNotice('Live forecast unavailable — using Tropical Storm fallback scenario.')
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
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-5 px-4 py-5 lg:px-6">
      <IntakeForm value={intake} onChange={setIntake} onSubmit={handleSubmit} submitting={submitting} stale={stale} />

      {notice && (
        <p role="status" className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
          {notice}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-12" aria-busy={submitting}>
        <section aria-labelledby="code-heading" className="flex flex-col gap-4 lg:col-span-5">
          <h2 id="code-heading" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
            <Building className="size-4 text-emerald-400" aria-hidden="true" />
            County Building Code &amp; Structural Resilience Breakdown
          </h2>
          <CodeScorecard evaluation={evaluation} />
          <VulnerabilityCard evaluation={evaluation} />
        </section>

        <section aria-labelledby="map-heading" className="flex flex-col gap-4 lg:col-span-7">
          <h2 id="map-heading" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
            <MapIcon className="size-4 text-emerald-400" aria-hidden="true" />
            Adaptive Emergency Shelter Map (Survivability Filtered)
          </h2>
          <ShelterPanel evaluation={evaluation} selectedId={selectedId} onSelect={setSelectedId} />
        </section>
      </div>

      <footer className="border-t border-slate-800 pt-4 text-xs leading-relaxed text-slate-500">
        Demonstration data for Orange, Durham, and Wake counties. Shelter ratings, BCAT attributes, and damage
        estimates are illustrative — always follow official instructions from ReadyNC and local emergency management.
      </footer>
    </div>
  )
}
