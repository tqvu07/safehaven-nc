'use client'

import dynamic from 'next/dynamic'
import { LoaderCircle, Navigation, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HIGH_CAPACITY_THRESHOLD } from '@/lib/safehaven/data'
import { directionsUrl, type Evaluation, type RankedShelter } from '@/lib/safehaven/risk'

const ShelterMap = dynamic(() => import('./shelter-map'), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
      <LoaderCircle className="mr-2 size-4 animate-spin" aria-hidden="true" />
      Loading map…
    </div>
  ),
})

function amenities(s: RankedShelter) {
  return [s.petFriendly && 'Pets allowed', s.ada && 'Wheelchair accessible', s.generator && 'Backup power']
    .filter(Boolean)
    .join(' · ')
}

function DirectionsLink({
  shelter,
  origin,
  compact,
  iconOnlyOnMobile,
}: {
  shelter: RankedShelter
  origin: [number, number]
  compact?: boolean
  iconOnlyOnMobile?: boolean
}) {
  return (
    <a
      href={directionsUrl(origin, shelter.coords)}
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

function ShelterDetails({ shelter, origin, onClose }: { shelter: RankedShelter; origin: [number, number]; onClose: () => void }) {
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
      <p className="mt-0.5 text-sm text-muted-foreground">{shelter.address}</p>
      <p className="mt-3 text-sm">
        {shelter.construction}, built for winds up to <strong className="font-semibold">{shelter.windRatingMph} mph</strong>
      </p>
      <p className="mt-1 text-sm tabular-nums text-muted-foreground">
        {shelter.distanceMi.toFixed(1)} mi · about {shelter.travelMin} min · room for {shelter.capacity.toLocaleString()}
      </p>
      {amenities(shelter) && <p className="mt-1 text-sm text-muted-foreground">{amenities(shelter)}</p>}
      <div className="mt-3">
        <DirectionsLink shelter={shelter} origin={origin} compact />
      </div>
    </div>
  )
}

interface ShelterPanelProps {
  evaluation: Evaluation
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function ShelterPanel({ evaluation, selectedId, onSelect }: ShelterPanelProps) {
  const { survivingShelters, filteredOutCount, input, unsafe } = evaluation
  const selected = survivingShelters.find((s) => s.id === selectedId) ?? null
  const nearest = survivingShelters.slice(0, 5)

  return (
    <section aria-labelledby="shelters-heading" className="overflow-hidden border-y border-border bg-card sm:rounded-xl sm:border">
      <div className="flex flex-wrap items-end justify-between gap-3 px-4 py-5 sm:p-5">
        <div>
          <h2 id="shelters-heading" className="text-base font-semibold">
            {unsafe ? 'Shelters near you' : 'Shelters near you, if you need one'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {survivingShelters.length} shelters are built to withstand {input.hazard.windMph} mph gusts
            {filteredOutCount > 0 && ` · ${filteredOutCount} weaker ones hidden`}
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
        <ShelterMap user={input.coords} shelters={survivingShelters} selectedId={selectedId} onSelect={(id) => onSelect(id)} />
        {selected && <ShelterDetails shelter={selected} origin={input.coords} onClose={() => onSelect(null)} />}
        {survivingShelters.length === 0 && (
          <div role="alert" className="absolute inset-x-3 top-3 z-[1000] rounded-lg border border-destructive/30 bg-card p-3 text-sm shadow-lg">
            <strong className="font-semibold text-destructive">No nearby shelter is rated for {input.hazard.windMph} mph.</strong>{' '}
            Go to a small interior room without windows on the lowest floor.
          </div>
        )}
      </div>

      {nearest.length > 0 && (
        <ol className="divide-y divide-border" aria-label="Nearest shelters">
          {nearest.map((s, i) => (
            <li
              key={s.id}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 transition sm:gap-4 sm:px-5',
                s.id === selectedId ? 'bg-accent' : 'hover:bg-muted/50',
              )}
            >
              <span className="w-4 shrink-0 self-start pt-0.5 text-sm tabular-nums text-muted-foreground">{i + 1}</span>
              <button type="button" onClick={() => onSelect(s.id)} className="min-w-0 flex-1 text-left">
                <span className="block font-medium leading-snug text-pretty sm:truncate">{s.name}</span>
                <span className="mt-0.5 block text-sm tabular-nums text-muted-foreground">
                  {s.distanceMi.toFixed(1)} mi · {s.travelMin} min drive
                </span>
                {amenities(s) && (
                  <span className="mt-0.5 block text-xs text-muted-foreground sm:truncate">{amenities(s)}</span>
                )}
              </button>
              <DirectionsLink shelter={s} origin={input.coords} compact iconOnlyOnMobile />
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
