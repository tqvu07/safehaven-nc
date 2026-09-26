import { cn } from '@/lib/utils'
import { STRUCTURE_TYPES, type ResistanceStatus } from '@/lib/safehaven/data'
import type { Evaluation } from '@/lib/safehaven/risk'

function CodeStatus({ status }: { status: ResistanceStatus }) {
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

export function HomeDetails({ evaluation }: { evaluation: Evaluation }) {
  const { county, legacyCode, input } = evaluation
  const homeType = STRUCTURE_TYPES.find((s) => s.id === input.structureType)?.label ?? input.structureType

  return (
    <section aria-labelledby="details-heading" className="border-y border-border bg-card px-4 py-5 sm:rounded-xl sm:border sm:p-5">
      <h2 id="details-heading" className="text-base font-semibold">
        How we got this
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Based on your county&apos;s building code and how your home was built.
      </p>

      <div className="mt-4 grid gap-x-8 md:grid-cols-2">
        <dl className="divide-y divide-border">
          <Row label="County">{county.name}</Row>
          <Row label="Home type">{homeType}</Row>
          <Row label="Building code">{legacyCode ? 'Pre-2000 (older code)' : 'Modern (2000 or later)'}</Row>
          <Row label="County design wind speed">{county.designWindMph} mph</Row>
        </dl>
        <dl className="divide-y divide-border">
          <Row label="Wind code">
            <CodeStatus status={county.bcat.wind} />
          </Row>
          <Row label="Flood code">
            <CodeStatus status={county.bcat.flood} />
          </Row>
          <Row label="Tornado code">
            <CodeStatus status={county.bcat.tornado} />
          </Row>
          <Row label="Past storm damage">
            {county.noaaEventCount} events since 2000
          </Row>
        </dl>
      </div>
    </section>
  )
}
