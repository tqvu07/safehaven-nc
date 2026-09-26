'use client'

import { useState } from 'react'
import { CloudRain, LoaderCircle, LocateFixed, MapPin, ShieldCheck, Tornado, Wind } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DEMO_LOCATIONS, STORM_SCENARIOS, STRUCTURE_TYPES, type StructureType } from '@/lib/safehaven/data'

export type ForecastMode = 'live' | 'scenario'

export interface IntakeState {
  coords: [number, number]
  locationLabel: string
  structureType: StructureType
  yearBuilt: number
  mode: ForecastMode
  scenarioId: string
}

interface IntakeFormProps {
  value: IntakeState
  onChange: (next: IntakeState) => void
  onSubmit: () => void
  submitting: boolean
  stale: boolean
}

const fieldClass =
  'h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30'

const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400'

export function IntakeForm({ value, onChange, onSubmit, submitting, stale }: IntakeFormProps) {
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const set = (patch: Partial<IntakeState>) => onChange({ ...value, ...patch })

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation unavailable in this browser.')
      return
    }
    setLocating(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        set({ coords: [pos.coords.latitude, pos.coords.longitude], locationLabel: 'My Location (GPS)' })
      },
      (err) => {
        setLocating(false)
        setGeoError(err.code === err.PERMISSION_DENIED ? 'Location permission denied.' : 'Unable to get location.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const demoId = DEMO_LOCATIONS.find((d) => d.label === value.locationLabel)?.id ?? ''

  return (
    <section aria-labelledby="intake-heading" className="rounded-xl border border-slate-800 bg-slate-900 p-4 lg:p-5">
      <h2 id="intake-heading" className="sr-only">
        Risk intake
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="grid gap-5 lg:grid-cols-12"
      >
        <fieldset className="flex flex-col gap-3 lg:col-span-3">
          <legend className={labelClass}>Location</legend>
          <button
            type="button"
            onClick={locate}
            disabled={locating}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-sky-500/40 bg-sky-500/10 px-3 text-sm font-medium text-sky-300 transition hover:bg-sky-500/20 disabled:opacity-60"
          >
            {locating ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <LocateFixed className="size-4" aria-hidden="true" />
            )}
            Locate My Coordinates
          </button>
          <div className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-300">
            <MapPin className="size-3.5 shrink-0 text-sky-400" aria-hidden="true" />
            <span aria-live="polite">
              {value.coords[0].toFixed(4)}, {value.coords[1].toFixed(4)}
            </span>
          </div>
          {geoError && (
            <p role="alert" className="text-xs text-amber-400">
              {geoError}
            </p>
          )}
          <div>
            <label htmlFor="demo-location" className={labelClass}>
              Demo Quick-Select
            </label>
            <select
              id="demo-location"
              className={fieldClass}
              value={demoId}
              onChange={(e) => {
                const loc = DEMO_LOCATIONS.find((d) => d.id === e.target.value)
                if (loc) set({ coords: loc.coords, locationLabel: loc.label })
              }}
            >
              {demoId === '' && <option value="">{value.locationLabel}</option>}
              {DEMO_LOCATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3 lg:col-span-3">
          <legend className={labelClass}>Home Structural Profile</legend>
          <div>
            <label htmlFor="structure-type" className="mb-1.5 block text-sm text-slate-300">
              Structure Type
            </label>
            <select
              id="structure-type"
              className={fieldClass}
              value={value.structureType}
              onChange={(e) => set({ structureType: e.target.value as StructureType })}
            >
              {STRUCTURE_TYPES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year-built" className="mb-1.5 block text-sm text-slate-300">
              Year Built
            </label>
            <input
              id="year-built"
              type="number"
              inputMode="numeric"
              min={1900}
              max={2026}
              className={cn(fieldClass, 'font-mono')}
              value={Number.isFinite(value.yearBuilt) ? value.yearBuilt : ''}
              onChange={(e) => set({ yearBuilt: Number.parseInt(e.target.value, 10) })}
            />
            <p className={cn('mt-1.5 text-xs', value.yearBuilt < 2000 ? 'text-amber-400' : 'text-emerald-400')}>
              {value.yearBuilt < 2000 ? 'Pre-2000 legacy code era' : 'Modern IRC continuous load path'}
            </p>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3 lg:col-span-4">
          <legend className={labelClass}>Weather Forecast Mode</legend>
          <div role="radiogroup" aria-label="Forecast source" className="grid grid-cols-2 gap-1 rounded-md border border-slate-800 bg-slate-950 p-1">
            {(
              [
                { id: 'live', label: 'Live Forecast', sub: 'Open-Meteo / NWS', icon: CloudRain },
                { id: 'scenario', label: 'Simulated Storm', sub: 'Scenario presets', icon: Wind },
              ] as const
            ).map(({ id, label, sub, icon: Icon }) => {
              const active = value.mode === id
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => set({ mode: id })}
                  className={cn(
                    'flex items-center gap-2 rounded px-3 py-2 text-left transition',
                    active ? 'bg-slate-800 text-slate-50' : 'text-slate-400 hover:text-slate-200',
                  )}
                >
                  <Icon className={cn('size-4 shrink-0', active && 'text-emerald-400')} aria-hidden="true" />
                  <span className="leading-tight">
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-[11px] text-slate-500">{sub}</span>
                  </span>
                </button>
              )
            })}
          </div>
          {value.mode === 'scenario' ? (
            <div role="radiogroup" aria-label="Storm scenario" className="grid grid-cols-2 gap-2">
              {STORM_SCENARIOS.map((s) => {
                const active = value.scenarioId === s.id
                const Icon = s.kind === 'tornado' ? Tornado : Wind
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => set({ scenarioId: s.id })}
                    className={cn(
                      'flex items-center gap-2 rounded-md border px-3 py-2 text-left transition',
                      active
                        ? 'border-amber-500/60 bg-amber-500/10 text-amber-200'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700',
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="leading-tight">
                      <span className="block text-sm font-medium">{s.label}</span>
                      <span className="block font-mono text-[11px] opacity-70">{s.shortLabel}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm leading-relaxed text-slate-400">
              Pulls the 72-hour peak wind gust and rainfall total for your coordinates from Open-Meteo (NWS/GFS
              blended) at evaluation time.
            </p>
          )}
        </fieldset>

        <div className="flex flex-col justify-end gap-2 lg:col-span-2">
          {stale && (
            <p className="text-xs text-amber-400" aria-live="polite">
              Inputs changed — re-evaluate to update results.
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-4 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-70"
          >
            {submitting ? (
              <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
            ) : (
              <ShieldCheck className="size-6" aria-hidden="true" />
            )}
            Evaluate Structural Risk &amp; Route Shelters
          </button>
        </div>
      </form>
    </section>
  )
}
