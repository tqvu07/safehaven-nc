import { CircleAlert, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usd, type Evaluation } from '@/lib/safehaven/risk'

function riskLevel(value: number) {
  if (value >= 50) return { label: 'High', bar: 'bg-destructive', text: 'text-destructive' }
  if (value >= 30) return { label: 'Moderate', bar: 'bg-warning', text: 'text-warning' }
  return { label: 'Low', bar: 'bg-success', text: 'text-success' }
}

function Stat({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <div className="flex flex-col gap-1 p-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums tracking-tight">{value}</dd>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  )
}

export function Verdict({ evaluation }: { evaluation: Evaluation }) {
  const { unsafe, input, homeWindRatingMph, vulnerability, estimatedDamage, homeValue } = evaluation
  const risk = riskLevel(vulnerability)
  const Icon = unsafe ? CircleAlert : CircleCheck

  return (
    <section aria-labelledby="verdict-heading" className="overflow-hidden rounded-xl border border-border bg-card">
      <div
        role={unsafe ? 'alert' : 'status'}
        className={cn('flex gap-3 border-l-4 p-5', unsafe ? 'border-destructive bg-destructive/5' : 'border-success bg-success/5')}
      >
        <Icon className={cn('mt-0.5 size-6 shrink-0', unsafe ? 'text-destructive' : 'text-success')} aria-hidden="true" />
        <div>
          <h2 id="verdict-heading" className="text-xl font-semibold tracking-tight text-balance">
            {unsafe ? 'Leave your home before the storm arrives' : 'Your home should hold up'}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
            {unsafe
              ? `Gusts of ${input.hazard.windMph} mph are stronger than your home is built to handle (about ${homeWindRatingMph} mph). Go to one of the shelters below.`
              : `Your home is built for about ${homeWindRatingMph} mph winds, above the ${input.hazard.windMph} mph gusts expected. Stay indoors and away from windows.`}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-y-2 border-t border-border px-1 py-2 md:grid-cols-4">
        <Stat
          label="Expected gusts"
          value={
            <>
              {input.hazard.windMph}
              <span className="ml-1 text-sm font-normal text-muted-foreground">mph</span>
            </>
          }
          note={`${input.hazard.label} · ${input.hazard.rainIn}" rain`}
        />
        <Stat
          label="Your home is rated for"
          value={
            <>
              {homeWindRatingMph}
              <span className="ml-1 text-sm font-normal text-muted-foreground">mph</span>
            </>
          }
          note={`Built ${input.yearBuilt}`}
        />
        <div className="flex flex-col gap-1 p-4">
          <dt className="text-sm text-muted-foreground">Damage risk</dt>
          <dd className={cn('text-2xl font-semibold tracking-tight', risk.text)}>{risk.label}</dd>
          <div
            className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={vulnerability}
            aria-label={`Damage risk ${vulnerability}%`}
          >
            <div className={cn('h-full rounded-full transition-[width] duration-500', risk.bar)} style={{ width: `${vulnerability}%` }} />
          </div>
          <p className="text-xs tabular-nums text-muted-foreground">{vulnerability}% chance of serious damage</p>
        </div>
        <Stat label="Estimated repairs" value={usd.format(estimatedDamage)} note={`of ${usd.format(homeValue)} home value`} />
      </dl>
    </section>
  )
}
