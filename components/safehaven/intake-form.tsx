'use client'

import { useState } from 'react'
import { LoaderCircle, LocateFixed } from 'lucide-react'
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
  'h-10 w-full rounded-md border border-input bg-card px-2.5 text-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'

const labelClass = 'mb-1.5 block text-sm font-medium'

export function IntakeForm({ value, onChange, onSubmit, submitting, stale }: IntakeFormProps) {
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const set = (patch: Partial<IntakeState>) => onChange({ ...value, ...patch })

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setGeoError('Your browser doesn’t support location.')
      return
    }
    setLocating(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        set({ coords: [pos.coords.latitude, pos.coords.longitude], locationLabel: 'My current location' })
      },
      (err) => {
        setLocating(false)
        setGeoError(err.code === err.PERMISSION_DENIED ? 'Location access was blocked.' : 'Couldn’t find your location.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const demoId = DEMO_LOCATIONS.find((d) => d.label === value.locationLabel)?.id ?? ''
  const legacy = Number.isFinite(value.yearBuilt) && value.yearBuilt < 2000

  return (
    <section aria-labelledby="intake-heading" className="rounded-xl border border-border bg-card p-5">
      <h2 id="intake-heading" className="text-base font-semibold">
        Your home
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Tell us where you live and how your home was built.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="mt-5 flex flex-col gap-5"
      >
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="demo-location" className="text-sm font-medium">
              Location
            </label>
            <button
              type="button"
              onClick={locate}
              disabled={locating}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline disabled:opacity-60"
            >
              {locating ? (
                <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <LocateFixed className="size-3.5" aria-hidden="true" />
              )}
              Use my location
            </button>
          </div>
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
          {geoError ? (
            <p role="alert" className="mt-1.5 text-xs text-destructive">
              {geoError}
            </p>
          ) : (
            <p className="mt-1.5 text-xs tabular-nums text-muted-foreground" aria-live="polite">
              {value.coords[0].toFixed(4)}, {value.coords[1].toFixed(4)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-[1fr_5rem] gap-3">
          <div className="min-w-0">
            <label htmlFor="structure-type" className={labelClass}>
              Home type
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
            <label htmlFor="year-built" className={labelClass}>
              Year built
            </label>
            <input
              id="year-built"
              type="number"
              inputMode="numeric"
              min={1900}
              max={2026}
              className={cn(fieldClass, 'tabular-nums')}
              value={Number.isFinite(value.yearBuilt) ? value.yearBuilt : ''}
              onChange={(e) => set({ yearBuilt: Number.parseInt(e.target.value, 10) })}
            />
          </div>
        </div>
        {legacy && (
          <p className="-mt-3 text-xs text-muted-foreground">
            Homes built before 2000 usually lack hurricane straps, so they&apos;re rated lower.
          </p>
        )}

        <fieldset>
          <legend className={labelClass}>Storm</legend>
          <div role="radiogroup" aria-label="Forecast source" className="grid grid-cols-2 rounded-md bg-muted p-1">
            {(
              [
                { id: 'scenario', label: 'What-if storm' },
                { id: 'live', label: 'Live forecast' },
              ] as const
            ).map(({ id, label }) => {
              const active = value.mode === id
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => set({ mode: id })}
                  className={cn(
                    'rounded px-3 py-1.5 text-sm font-medium transition',
                    active ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {value.mode === 'scenario' ? (
            <div role="radiogroup" aria-label="Storm scenario" className="mt-3 flex flex-col gap-1.5">
              {STORM_SCENARIOS.map((s) => {
                const active = value.scenarioId === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => set({ scenarioId: s.id })}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition',
                      active ? 'border-primary bg-accent' : 'border-border hover:bg-muted',
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          'flex size-4 items-center justify-center rounded-full border',
                          active ? 'border-primary' : 'border-input',
                        )}
                        aria-hidden="true"
                      >
                        {active && <span className="size-2 rounded-full bg-primary" />}
                      </span>
                      <span className="font-medium">{s.label}</span>
                    </span>
                    <span className="tabular-nums text-muted-foreground">{s.windMph} mph</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We&apos;ll use the strongest wind gust and total rainfall forecast for your location over the next 3
              days.
            </p>
          )}
        </fieldset>

        <div className="flex flex-col gap-2 border-t border-border pt-5">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:opacity-70"
          >
            {submitting && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
            {submitting ? 'Checking…' : 'Check my home'}
          </button>
          {stale && (
            <p className="text-center text-xs text-muted-foreground" aria-live="polite">
              You changed something — check again to update the results.
            </p>
          )}
        </div>
      </form>
    </section>
  )
}
