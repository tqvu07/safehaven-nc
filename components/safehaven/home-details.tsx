import { cn } from '@/lib/utils'
import { STRUCTURE_TYPES } from '@/lib/safehaven/data'
import type { ApiEvaluation } from '@/lib/safehaven/api'
import type { IntakeState } from './intake-form'

function CodeStatus({ status, stormWindMph }: { status: string; stormWindMph: number }) {
  const calm = stormWindMph < 40
  const ok = status === 'Resistant'
  const alert = stormWindMph >= 40 && !ok

  const label = calm ? 'County Code Standard: Legacy / Baseline' : ok ? 'County Code Standard: Resistant' : 'County Code Standard: Not Resistant'
  const helper = calm
    ? 'FEMA rating for extreme storm events, not active danger.'
    : ok
      ? 'FEMA rating reflects adequate protection for severe storm conditions.'
      : 'Active storm vulnerability: structural risk during the current event.'

  return (
    <div className="flex flex-col items-start gap-1">
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium',
          calm ? 'border-border bg-muted/70 text-slate-700' : alert ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-success/20 bg-success/10 text-success',
        )}
      >
        <span className={cn('size-1.5 rounded-full', calm ? 'bg-slate-500' : alert ? 'bg-amber-500' : 'bg-success')} aria-hidden="true" />
        {label}
      </span>
      <span className="text-[11px] leading-relaxed text-muted-foreground">{helper}</span>
      <span className="text-[11px] leading-relaxed text-muted-foreground">
        FEMA BCAT evaluates structural resilience under severe hurricane conditions (74+ mph). Current conditions are {calm ? 'calm.' : 'active.'}
      </span>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 min-[400px]:flex-row min-[400px]:items-baseline min-[400px]:justify-between min-[400px]:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium min-[400px]:text-right">{children}</dd>
    </div>
  )
}

export function HomeDetails({ evaluation, intake }: { evaluation: ApiEvaluation; intake: IntakeState }) {
  const homeType = STRUCTURE_TYPES.find((s) => s.id === intake.structureType)?.label ?? intake.structureType
  const legacy = Number.isFinite(intake.yearBuilt) && intake.yearBuilt < 2000

  return (
    <section aria-labelledby="details-heading" className="border-y border-border bg-card px-4 py-5 sm:rounded-xl sm:border sm:p-5">
      <h2 id="details-heading" className="text-base font-semibold">
        How we got this
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Based on your county&apos;s FEMA BCAT rating and how your home was built.
      </p>

      <div className="mt-4 grid gap-x-8 md:grid-cols-2">
        <dl className="divide-y divide-border">
          <Row label="County">{evaluation.county_name}</Row>
          <Row label="County FIPS">{evaluation.county_fips}</Row>
          <Row label="Home type">{homeType}</Row>
          <Row label="Building code">{legacy ? 'Pre-2000 (older code)' : 'Modern (2000 or later)'}</Row>
        </dl>
        <dl className="divide-y divide-border">
          <Row label="Wind code">
            <CodeStatus status={evaluation.bcat_wind_resistance} stormWindMph={evaluation.storm_wind_mph} />
          </Row>
          <Row label="Flood code">
            <CodeStatus status={evaluation.bcat_flood_resistance} />
          </Row>
          <Row label="Code edition">{evaluation.building_code_era}</Row>
          <Row label="Storm wind used">{Math.round(evaluation.storm_wind_mph)} mph</Row>
        </dl>
      </div>
    </section>
  )
}
