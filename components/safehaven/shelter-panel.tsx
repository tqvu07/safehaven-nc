'use client'

import dynamic from 'next/dynamic'
import { LoaderCircle, Navigation, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HIGH_CAPACITY_THRESHOLD } from '@/lib/safehaven/data'
import type { ApiEvaluation, ApiShelter } from '@/lib/safehaven/api'

const ShelterMap = dynamic(() => import('./shelter-map'), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
      <LoaderCircle className="mr-2 size-4 animate-spin" aria-hidden="true" />
      Loading map…
    </div>
  ),
})

function amenities(s: ApiShelter) {
  return [s.pet_friendly && 'Pets allowed', s.ada_accessible && 'Wheelchair accessible', s.generator && 'Backup power']
    .filter(Boolean)
    .join(' · ')
}

function occupancyState(s: ApiShelter) {
  const capacity = Number(s.evacuation_capacity ?? s.capacity ?? 0)
  const totalPopulation = Number(s.total_population ?? 0)
  const remainingCapacity = Number(s.remaining_capacity ?? Math.max(capacity - totalPopulation, 0))
  const occupancyPercent = capacity > 0 ? Math.round((totalPopulation / capacity) * 100) || 0 : 0
  const status = (s.shelter_status ?? '').trim().toUpperCase()
  const isFull = status === 'FULL' || occupancyPercent > 90 || remainingCapacity <= 0

  let tone: 'green' | 'amber' | 'red' = 'green'
  if (isFull) tone = 'red'
  else if (occupancyPercent >= 70) tone = 'amber'

  const badgeText = isFull
    ? 'At Capacity'
    : remainingCapacity > 0
      ? `Available Spots: ${remainingCapacity}`
      : 'No spots left'

  return { capacity, totalPopulation, remainingCapacity, occupancyPercent, status, isFull, tone, badgeText }
}

function DirectionsLink({
  shelter,
  compact,
  iconOnlyOnMobile,
}: {
  shelter: ApiShelter
  compact?: boolean
  iconOnlyOnMobile?: boolean
}) {
  return (
    <a
      href={shelter.navigation_url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary font-medium text-primary-foreground transition hover:bg-primary/90',
        compact ? 'h-9 px-3 text-sm sm:h-8' : 'h-9 px-3.5 text-sm',
        iconOnlyOnMobile && 'w-10 px-0 sm:w-auto sm:px-3',
      )}
    >
      <Navigation className="size-4 sm:size-3.5" aria-hidden="true" />
      <span className={cn(iconOnlyOnMobile && 'sr-only sm:not-sr-only')}>Directions</span>
      <span className="sr-only"> to {shelter.name} (opens Google Maps)</span>
    </a>
  )
}

function ShelterDetails({ shelter, onClose }: { shelter: ApiShelter; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-labelledby="shelter-detail-title"
      className="absolute inset-x-3 bottom-3 z-[1000] rounded-lg border border-border bg-card p-4 shadow-lg sm:left-3 sm:right-auto sm:w-80"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Close shelter details"
      >
        <X className="size-4" />
      </button>
      <h3 id="shelter-detail-title" className="pr-6 font-semibold">
        {shelter.name}
      </h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{shelter.county} County</p>
      <p className="mt-3 text-sm">
        Rated for winds up to <strong className="font-semibold">{shelter.max_wind_rating_mph} mph</strong>
      </p>
      <p className="mt-1 text-sm tabular-nums text-muted-foreground">
        {shelter.distance_miles.toFixed(1)} mi away · room for {shelter.capacity.toLocaleString()}
      </p>
      {amenities(shelter) && <p className="mt-1 text-sm text-muted-foreground">{amenities(shelter)}</p>}
      {(() => {
        const state = occupancyState(shelter)
        const fillTone =
          state.tone === 'green' ? 'bg-success' : state.tone === 'amber' ? 'bg-warning' : 'bg-destructive'

        return (
          <div className="mt-3 rounded-md border border-border bg-muted/30 p-2.5">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-muted-foreground">Live occupancy</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                  state.isFull ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary',
                )}
              >
                {state.badgeText}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className={cn('h-full rounded-full transition-all', fillTone)} style={{ width: `${Math.min(state.occupancyPercent, 100)}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Occupancy: {state.totalPopulation} / {state.capacity} ({state.occupancyPercent}% filled)
            </p>
            {state.isFull && <p className="mt-1 text-[11px] font-medium text-destructive">At Capacity</p>}
          </div>
        )
      })()}
      <div className="mt-3">
        <DirectionsLink shelter={shelter} compact />
      </div>
    </div>
  )
}

interface ShelterPanelProps {
  evaluation: ApiEvaluation
  userCoords: [number, number]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function ShelterPanel({ evaluation, userCoords, selectedId, onSelect }: ShelterPanelProps) {
  const shelters = evaluation.survivable_shelters
  const selected = shelters.find((s) => s.name === selectedId) ?? null
  const nearest = shelters.slice(0, 5)
  const unsafe = evaluation.vulnerability_score >= 50
  const nearestDistance = shelters.length > 0 ? Math.min(...shelters.map((s) => Number(s.distance_miles ?? 0))) : null
  const distantAdvisory = nearestDistance !== null && nearestDistance > 25

  return (
    <section aria-labelledby="shelters-heading" className="overflow-hidden border-y border-border bg-card sm:rounded-xl sm:border">
      <div className="flex flex-wrap items-end justify-between gap-3 px-4 py-5 sm:p-5">
        <div>
          <h2 id="shelters-heading" className="text-base font-semibold">
            {unsafe ? 'Shelters near you' : 'Shelters near you, if you need one'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {shelters.length} shelter{shelters.length === 1 ? '' : 's'} rated to withstand {Math.round(evaluation.storm_wind_mph)} mph gusts
          </p>
        </div>
        <ul className="flex items-center gap-4 text-xs text-muted-foreground" aria-label="Map legend">
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full border-2 border-card bg-foreground ring-1 ring-foreground" aria-hidden="true" />
            You
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full border-2 border-primary bg-card" aria-hidden="true" />
            Shelter
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-primary" aria-hidden="true" />
            {`Large (${HIGH_CAPACITY_THRESHOLD.toLocaleString()}+)`}
          </li>
        </ul>
      </div>

      <div className="relative h-[320px] border-y sm:h-[380px] border-border lg:h-[440px]">
        <ShelterMap user={userCoords} shelters={shelters} selectedId={selectedId} onSelect={(id) => onSelect(id)} />
        {selected && <ShelterDetails shelter={selected} onClose={() => onSelect(null)} />}
        {shelters.length === 0 && (
          <div role="alert" className="absolute inset-x-3 top-3 z-[1000] rounded-lg border border-destructive/30 bg-card p-3 text-sm shadow-lg">
            <strong className="font-semibold text-destructive">No nearby shelter is rated for {Math.round(evaluation.storm_wind_mph)} mph.</strong>{' '}
            Go to a small interior room without windows on the lowest floor.
          </div>
        )}
      </div>

      {distantAdvisory && (
        <div className="border-t border-border bg-amber-50 px-4 py-2 text-sm text-amber-800 sm:px-5">
          Regional facility: local municipal evacuation sites may be designated by county emergency management during active events.
        </div>
      )}

      {nearest.length > 0 && (
        <ol className="divide-y divide-border" aria-label="Nearest shelters">
          {nearest.map((s, i) => {
            const state = occupancyState(s)
            const isDisabled = state.isFull

            return (
              <li
                key={s.name}
                className={cn(
                  'flex items-center gap-3 px-4 py-3.5 transition sm:gap-4 sm:px-5',
                  s.name === selectedId ? 'bg-accent' : 'hover:bg-muted/50',
                  isDisabled && 'opacity-80',
                )}
              >
                <span className="w-4 shrink-0 self-start pt-0.5 text-sm tabular-nums text-muted-foreground">{i + 1}</span>
                <button
                  type="button"
                  onClick={() => !isDisabled && onSelect(s.name)}
                  disabled={isDisabled}
                  className={cn('min-w-0 flex-1 text-left', isDisabled && 'cursor-not-allowed opacity-80')}
                >
                  <span className="flex items-center gap-2">
                    <span className="block font-medium leading-snug text-pretty sm:truncate">{s.name}</span>
                    {isDisabled && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                        At Capacity
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm tabular-nums text-muted-foreground">{s.distance_miles.toFixed(1)} mi away</span>
                  {amenities(s) && <span className="mt-0.5 block text-xs text-muted-foreground sm:truncate">{amenities(s)}</span>}
                  <div className="mt-2">
                    <div className="mb-1 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                      <span>Capacity</span>
                      <span>{state.badgeText}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          state.tone === 'green' ? 'bg-success' : state.tone === 'amber' ? 'bg-warning' : 'bg-destructive',
                        )}
                        style={{ width: `${Math.min(state.occupancyPercent, 100)}%` }}
                      />
                    </div>
                    <span className="mt-1 block text-[10px] text-muted-foreground">
                      {state.totalPopulation} / {state.capacity} ({state.occupancyPercent}% filled)
                    </span>
                  </div>
                </button>
                <DirectionsLink shelter={s} compact iconOnlyOnMobile />
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
