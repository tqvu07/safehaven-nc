'use client'

import dynamic from 'next/dynamic'
import {
  Accessibility,
  Clock,
  Flame,
  LoaderCircle,
  MapPin,
  Navigation,
  PawPrint,
  ShieldCheck,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { HIGH_CAPACITY_THRESHOLD } from '@/lib/safehaven/data'
import { directionsUrl, type Evaluation, type RankedShelter } from '@/lib/safehaven/risk'

const ShelterMap = dynamic(() => import('./shelter-map'), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center bg-slate-950 text-sm text-slate-400">
      <LoaderCircle className="mr-2 size-4 animate-spin" aria-hidden="true" />
      Loading shelter map…
    </div>
  ),
})

function FeatureBadges({ shelter }: { shelter: RankedShelter }) {
  const badges = [
    shelter.petFriendly && { label: 'Pet-Friendly', icon: PawPrint },
    shelter.ada && { label: 'ADA Accessible', icon: Accessibility },
    shelter.generator && { label: 'Generator-Ready', icon: Zap },
  ].filter(Boolean) as { label: string; icon: typeof Zap }[]
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Shelter amenities">
      {badges.map(({ label, icon: Icon }) => (
        <li
          key={label}
          className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 text-[11px] text-slate-300"
        >
          <Icon className="size-3 text-emerald-400" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  )
}

function ShelterDetails({
  shelter,
  origin,
  onClose,
}: {
  shelter: RankedShelter
  origin: [number, number]
  onClose: () => void
}) {
  return (
    <div
      role="dialog"
      aria-labelledby="shelter-detail-title"
      className="absolute inset-x-3 bottom-3 z-[1000] rounded-lg border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur sm:left-auto sm:w-96"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        aria-label="Close shelter details"
      >
        <X className="size-4" />
      </button>
      <h4 id="shelter-detail-title" className="pr-6 text-base font-semibold text-slate-50">
        {shelter.name}
      </h4>
      <p className="mt-0.5 flex items-start gap-1 text-xs text-slate-400">
        <MapPin className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
        {shelter.address}
      </p>
      <p className="mt-3 flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-200">
        <ShieldCheck className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />
        {shelter.construction} / Wind Resilient up to {shelter.windRatingMph} mph
      </p>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-slate-950 py-1.5">
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Capacity</dt>
          <dd className="font-mono text-sm text-slate-100">{shelter.capacity.toLocaleString()}</dd>
        </div>
        <div className="rounded-md bg-slate-950 py-1.5">
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Distance</dt>
          <dd className="font-mono text-sm text-slate-100">{shelter.distanceMi.toFixed(1)} mi</dd>
        </div>
        <div className="rounded-md bg-slate-950 py-1.5">
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Drive</dt>
          <dd className="font-mono text-sm text-slate-100">~{shelter.travelMin} min</dd>
        </div>
      </dl>
      <div className="mt-3 flex items-center justify-between gap-2">
        <FeatureBadges shelter={shelter} />
        <a
          href={directionsUrl(origin, shelter.coords)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-500 px-2.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
        >
          <Navigation className="size-3.5" aria-hidden="true" />
          Go
        </a>
      </div>
    </div>
  )
}

function RouteCard({
  shelter,
  rank,
  origin,
  selected,
  onSelect,
}: {
  shelter: RankedShelter
  rank: number
  origin: [number, number]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <li
      className={cn(
        'flex flex-col gap-3 rounded-xl border bg-slate-900 p-4 transition',
        selected ? 'border-emerald-500/70' : 'border-slate-800 hover:border-slate-700',
      )}
    >
      <button type="button" onClick={onSelect} className="flex items-start gap-3 text-left">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 font-mono text-sm font-semibold text-emerald-300">
          {rank}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-slate-50">{shelter.name}</span>
          <span className="block text-xs text-slate-400">Rated {shelter.windRatingMph} mph</span>
        </span>
      </button>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 whitespace-nowrap font-mono text-xs text-slate-200">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5 text-slate-500" aria-hidden="true" />
          {shelter.distanceMi.toFixed(1)} mi
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5 text-slate-500" aria-hidden="true" />~{shelter.travelMin} min
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="size-3.5 text-slate-500" aria-hidden="true" />
          {shelter.capacity.toLocaleString()}
        </span>
      </div>
      <a
        href={directionsUrl(origin, shelter.coords)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex h-9 items-center justify-center gap-2 rounded-md bg-emerald-500 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
      >
        <Navigation className="size-4" aria-hidden="true" />
        Navigate Now
        <span className="sr-only"> to {shelter.name} (opens Google Maps)</span>
      </a>
    </li>
  )
}

interface ShelterPanelProps {
  evaluation: Evaluation
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function ShelterPanel({ evaluation, selectedId, onSelect }: ShelterPanelProps) {
  const { survivingShelters, filteredOutCount, input } = evaluation
  const selected = survivingShelters.find((s) => s.id === selectedId) ?? null
  const top3 = survivingShelters.slice(0, 3)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          {survivingShelters.length} shelters rated ≥ {input.hazard.windMph} mph
        </span>
        {filteredOutCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-red-300">
            <Flame className="size-3.5" aria-hidden="true" />
            {filteredOutCount} hidden — below hazard tier
          </span>
        )}
        <span className="ml-auto flex items-center gap-3 text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-blue-500" aria-hidden="true" /> You
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2.5 rounded-sm bg-emerald-500" aria-hidden="true" /> {'High capacity (1,000+)'}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2.5 rounded-sm border border-emerald-500 bg-slate-900" aria-hidden="true" /> Standard
          </span>
        </span>
      </div>

      <div className="relative h-[420px] overflow-hidden rounded-xl border border-slate-800 lg:h-[520px]">
        <ShelterMap
          user={input.coords}
          shelters={survivingShelters}
          selectedId={selectedId}
          onSelect={(id) => onSelect(id)}
        />
        {selected && <ShelterDetails shelter={selected} origin={input.coords} onClose={() => onSelect(null)} />}
        {survivingShelters.length === 0 && (
          <div className="absolute inset-x-3 top-3 z-[1000] rounded-lg border border-red-500 bg-red-950/90 p-3 text-sm text-red-100">
            No certified shelters in the Triangle are rated for {input.hazard.windMph} mph. Move to an interior,
            windowless room on the lowest floor.
          </div>
        )}
      </div>

      <section aria-labelledby="routes-heading">
        <h3 id="routes-heading" className="mb-3 text-sm font-semibold text-slate-200">
          Priority Evacuation Route Cards
        </h3>
        {top3.length > 0 ? (
          <ol className="grid gap-3 md:grid-cols-3">
            {top3.map((s, i) => (
              <RouteCard
                key={s.id}
                shelter={s}
                rank={i + 1}
                origin={input.coords}
                selected={s.id === selectedId}
                onSelect={() => onSelect(s.id)}
              />
            ))}
          </ol>
        ) : (
          <p className="text-sm text-slate-400">No surviving shelters for this hazard tier.</p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          {`Shelters filtered by rated wind capacity vs. current hazard tier. High-capacity threshold: ${HIGH_CAPACITY_THRESHOLD.toLocaleString()} occupants.`}
        </p>
      </section>
    </div>
  )
}
