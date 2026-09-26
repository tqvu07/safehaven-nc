'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { HIGH_CAPACITY_THRESHOLD } from '@/lib/safehaven/data'
import type { RankedShelter } from '@/lib/safehaven/risk'

const SHIELD_PATH =
  'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'

function shieldIcon(highCapacity: boolean, selected: boolean) {
  const size = highCapacity ? 34 : 26
  const fill = highCapacity ? '#10b981' : '#0f172a'
  const stroke = selected ? '#f8fafc' : highCapacity ? '#022c22' : '#10b981'
  return L.divIcon({
    className: 'sh-marker',
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="${selected ? 2.4 : 1.8}" stroke-linejoin="round" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.6))"><path d="${SHIELD_PATH}"/><path d="m9 12 2 2 4-4" stroke="${highCapacity ? '#022c22' : '#10b981'}" fill="none"/></svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

const homeIcon = L.divIcon({
  className: 'sh-marker',
  html: `<div class="sh-home"><span class="sh-radar"></span><span class="sh-radar sh-radar-delay"></span><svg width="30" height="30" viewBox="0 0 24 24" fill="#3b82f6" stroke="#eff6ff" stroke-width="1.8" stroke-linejoin="round"><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

function FitBounds({ user, shelters }: { user: [number, number]; shelters: RankedShelter[] }) {
  const map = useMap()
  useEffect(() => {
    const nearest = shelters.slice(0, 6).map((s) => s.coords)
    const bounds = L.latLngBounds([user, ...nearest])
    map.flyToBounds(bounds.pad(0.15), { maxZoom: 13, duration: 0.8 })
  }, [map, user, shelters])
  return null
}

interface ShelterMapProps {
  user: [number, number]
  shelters: RankedShelter[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function ShelterMap({ user, shelters, selectedId, onSelect }: ShelterMapProps) {
  const icons = useMemo(
    () => ({
      high: shieldIcon(true, false),
      highSel: shieldIcon(true, true),
      std: shieldIcon(false, false),
      stdSel: shieldIcon(false, true),
    }),
    [],
  )

  return (
    <MapContainer center={user} zoom={12} scrollWheelZoom className="size-full bg-slate-950" attributionControl>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="sh-dark-tiles"
      />
      <FitBounds user={user} shelters={shelters} />
      <Marker position={user} icon={homeIcon} zIndexOffset={1000}>
        <Tooltip direction="top" offset={[0, -14]}>
          Your location
        </Tooltip>
      </Marker>
      {shelters.map((s) => {
        const high = s.capacity >= HIGH_CAPACITY_THRESHOLD
        const selected = s.id === selectedId
        return (
          <Marker
            key={s.id}
            position={s.coords}
            icon={high ? (selected ? icons.highSel : icons.high) : selected ? icons.stdSel : icons.std}
            zIndexOffset={selected ? 900 : 0}
            eventHandlers={{ click: () => onSelect(s.id) }}
            title={s.name}
            alt={s.name}
            keyboard
          >
            <Tooltip direction="top" offset={[0, -14]}>
              {s.name}
            </Tooltip>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
