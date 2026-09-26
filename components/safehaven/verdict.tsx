import { CircleAlert, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usd } from '@/lib/safehaven/risk'
import type { ApiEvaluation } from '@/lib/safehaven/api'

function riskLevel(value: number) {
  if (value >= 50) return { label: 'High', bar: 'bg-destructive', text: 'text-destructive' }
  if (value >= 30) return { label: 'Moderate', bar: 'bg-warning', text: 'text-warning' }
  return { label: 'Low', bar: 'bg-success', text: 'text-success' }
}

function Stat({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <div className="flex flex-col gap-1 px-3 py-3 sm:p-4">
      <dt className="text-xs text-muted-foreground sm:text-sm">{label}</dt>
      <dd className="text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">{value}</dd>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  )
}

function ResistanceBadge({ status, stormWindMph }: { status: string; stormWindMph: number }) {
  const calm = stormWindMph < 40
  const ok = status === 'Resistant'
  const alert = stormWindMph >= 40 && !ok

  const label = calm ? 'County Code Standard: Legacy / Baseline' : ok ? 'County Code Standard: Resistant' : 'County Code Standard: Not Resistant'
  const helper = calm
    ? 'FEMA rating for extreme storm events, not active danger.'
    : ok
      ? 'FEMA rating reflects adequate protection for severe storm conditions.'
      : 'Structural vulnerability during active storm conditions.'

  return (
    <div className="flex flex-col items-start gap-1.5" title="FEMA structural resistance rating for severe hurricane loads.">
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm font-semibold tracking-tight sm:text-lg',
          calm ? 'border-slate-200 bg-slate-100 text-slate-700' : alert ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-success/20 bg-success/10 text-success',
        )}
      >
        <span className={cn('size-2 rounded-full', calm ? 'bg-slate-500' : alert ? 'bg-amber-500' : 'bg-success')} aria-hidden="true" />
        {label}
      </span>
      <span className="max-w-[22rem] text-[11px] leading-relaxed text-muted-foreground">
        {helper}
      </span>
      <span className="text-[11px] leading-relaxed text-muted-foreground">
        FEMA BCAT evaluates structural resilience under severe hurricane conditions (74+ mph). Current conditions are {calm ? 'calm.' : 'active.'}
      </span>
    </div>
  )
}

export function Verdict({ evaluation }: { evaluation: ApiEvaluation }) {
  const { vulnerability_score, storm_wind_mph, predicted_damage_usd, recommendation, bcat_wind_resistance, building_code_era, county_name } =
    evaluation
  const risk = riskLevel(vulnerability_score)
  const unsafe = vulnerability_score >= 50
  const Icon = unsafe ? CircleAlert : CircleCheck
  const weather = evaluation.weather ?? null
  const floodAdvisory = weather?.precipitation_next_24h_in != null && weather.precipitation_next_24h_in >= 2.0

  return (
    <section aria-labelledby="verdict-heading" className="overflow-hidden border-y border-border bg-card sm:rounded-xl sm:border">
      <div
        role={unsafe ? 'alert' : 'status'}
        className={cn('flex gap-3 border-l-4 px-4 py-5 sm:p-5', unsafe ? 'border-destructive bg-destructive/5' : 'border-success bg-success/5')}
      >
        <Icon className={cn('mt-0.5 size-6 shrink-0', unsafe ? 'text-destructive' : 'text-success')} aria-hidden="true" />
        <div>
          <h2 id="verdict-heading" className="text-xl font-semibold tracking-tight text-balance">
            {unsafe ? 'Leave your home before the storm arrives' : 'Your home should hold up'}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">{recommendation}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-y-2 border-t border-border px-1 py-2 md:grid-cols-4">
        <Stat
          label="Expected gusts"
          value={
            <>
              {Math.round(storm_wind_mph)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">mph</span>
            </>
          }
          note={county_name}
        />
        <Stat
          label="County wind code"
          value={<ResistanceBadge status={bcat_wind_resistance} stormWindMph={storm_wind_mph} />}
          note={building_code_era}
        />
        <div className="flex flex-col gap-1 px-3 py-3 sm:p-4">
          <dt className="text-xs text-muted-foreground sm:text-sm">Damage risk</dt>
          <dd className={cn('text-xl font-semibold tracking-tight sm:text-2xl', risk.text)}>{risk.label}</dd>
          <div
            className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={vulnerability_score}
            aria-label={`Damage risk ${vulnerability_score}%`}
          >
            <div className={cn('h-full rounded-full transition-[width] duration-500', risk.bar)} style={{ width: `${vulnerability_score}%` }} />
          </div>
          <p className="text-xs tabular-nums text-muted-foreground">{vulnerability_score}% chance of serious damage</p>
        </div>
        <Stat label="Estimated repairs" value={usd.format(predicted_damage_usd)} />
      </dl>

      <div className="border-t border-border bg-muted/30 px-3 py-2.5 sm:px-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="rounded-md border border-border bg-background px-2 py-1 font-medium text-foreground">
            {weather?.current_temp_f != null ? `Temp: ${weather.current_temp_f}°F` : 'Temp: n/a'}
          </span>
          <span className="rounded-md border border-border bg-background px-2 py-1 font-medium text-foreground">
            {weather?.wind_gusts_mph != null ? `Peak 24h Wind Gust: ${weather.wind_gusts_mph} mph` : 'Peak 24h Wind Gust: n/a'}
          </span>
          <span className="rounded-md border border-border bg-background px-2 py-1 font-medium text-foreground">
            {weather?.precipitation_next_24h_in != null ? `24h Rainfall: ${weather.precipitation_next_24h_in} in` : '24h Rainfall: n/a'}
          </span>
        </div>
        {floodAdvisory && (
          <div className="mt-2 inline-flex rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
            Inland Flood Threat: Heavy localized rainfall expected.
          </div>
        )}
      </div>
    </section>
  )
}
