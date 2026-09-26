import { Building, CloudRain, ShieldAlert, ShieldCheck, Tornado, TriangleAlert, Wind } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResistanceStatus } from '@/lib/safehaven/data'
import type { Evaluation } from '@/lib/safehaven/risk'

function StatusChip({ label, status, icon: Icon }: { label: string; status: ResistanceStatus; icon: typeof Wind }) {
  const ok = status === 'Resistant'
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col items-start gap-1.5 rounded-md border px-3 py-2 sm:flex-col [&>*]:max-w-full',
        ok ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5',
      )}
    >
      <span className="flex items-center gap-2 text-sm text-slate-300">
        <Icon className="size-4 text-slate-400" aria-hidden="true" />
        {label}
      </span>
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
          ok ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300',
        )}
      >
        {ok ? <ShieldCheck className="size-3" aria-hidden="true" /> : <ShieldAlert className="size-3" aria-hidden="true" />}
        {status}
      </span>
    </div>
  )
}

export function CodeScorecard({ evaluation }: { evaluation: Evaluation }) {
  const { county, legacyCode, input, homeWindRatingMph } = evaluation
  const exceeded = input.hazard.windMph > homeWindRatingMph

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building className="size-5 text-emerald-400" aria-hidden="true" />
            <h3 className="text-base font-semibold text-slate-50">{county.name}</h3>
          </div>
          <span className="rounded border border-slate-700 bg-slate-950 px-2 py-0.5 font-mono text-xs text-slate-300">
            FIPS {county.fips}
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <StatusChip label="Wind" status={county.bcat.wind} icon={Wind} />
          <StatusChip label="Flood" status={county.bcat.flood} icon={CloudRain} />
          <StatusChip label="Tornado" status={county.bcat.tornado} icon={Tornado} />
        </div>

        <div
          className={cn(
            'mt-3 flex items-start gap-3 rounded-md border px-3 py-2.5',
            legacyCode ? 'border-amber-500/40 bg-amber-500/10' : 'border-emerald-500/30 bg-emerald-500/5',
          )}
        >
          {legacyCode ? (
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-400" aria-hidden="true" />
          ) : (
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
          )}
          <div className="text-sm">
            <p className={cn('font-semibold', legacyCode ? 'text-amber-300' : 'text-emerald-300')}>
              {legacyCode ? 'Pre-2000 Legacy Code — Warning' : 'Modern Post-2000 IRC Continuous Load Path'}
            </p>
            <p className="text-slate-400">
              {legacyCode
                ? `Built ${input.yearBuilt}, before NC adopted IRC hurricane-strap and continuous load path requirements.`
                : `Built ${input.yearBuilt} under IRC-based code with roof-to-foundation uplift connections.`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={cn('rounded-xl border bg-slate-900 p-4', exceeded ? 'border-red-500/40' : 'border-slate-800')}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Expected Peak Wind</p>
          <p className={cn('mt-1 font-mono text-3xl font-semibold', exceeded ? 'text-red-400' : 'text-amber-300')}>
            {input.hazard.windMph}
            <span className="ml-1 text-sm font-normal text-slate-400">mph</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {input.hazard.label} · {input.hazard.rainIn}&quot; rain
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Home Wind Rating</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-slate-50">
            {homeWindRatingMph}
            <span className="ml-1 text-sm font-normal text-slate-400">mph</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">County design basis {county.designWindMph} mph</p>
        </div>
      </div>
    </div>
  )
}
