import { cn } from '@/lib/utils'
import { STRUCTURE_TYPES } from '@/lib/safehaven/data'
import type { ApiEvaluation } from '@/lib/safehaven/api'
import type { IntakeState } from './intake-form'

function CodeStatus({ status }: { status: string }) {
  const ok = status === 'Resistant'
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', ok ? 'text-success' : 'text-destructive')}>
      <span className={cn('size-1.5 rounded-full', ok ? 'bg-success' : 'bg-destructive')} aria-hidden="true" />
      {ok ? 'Meets FEMA standard' : 'Below FEMA standard'}
    </span>
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
            <CodeStatus status={evaluation.bcat_wind_resistance} />
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
