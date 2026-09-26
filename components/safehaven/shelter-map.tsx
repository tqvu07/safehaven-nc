'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { HIGH_CAPACITY_THRESHOLD } from '@/lib/safehaven/data'
import type { RankedShelter } from '@/lib/safehaven/risk'

const PRIMARY = '#1d4ed8'

function shelterIcon(highCapacity: boolean, selected: boolean) {
  const size = (highCapacity ? 18 : 14) + (selected ? 6 : 0)
  const fill = highCapacity ? PRIMARY : '#ffffff'
  const ring = selected ? `box-shadow:0 0 0 4px rgb(29 78 216 / .25),0 1px 3px rgb(0 0 0 / .3);` : 'box-shadow:0 1px 3px rgb(0 0 0 / .3);'
  return L.divIcon({
    className: 'sh-marker',
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${fill};border:${highCapacity ? '2px solid #fff' : `3px solid ${PRIMARY}`};${ring}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

const homeIcon = L.divIcon({
  className: 'sh-marker',
  html: `<div class="sh-home"><span class="sh-radar"></span></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
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
      high: shelterIcon(true, false),
      highSel: shelterIcon(true, true),
      std: shelterIcon(false, false),
      stdSel: shelterIcon(false, true),
    }),
    [],
  )

  return (
    <MapContainer center={user} zoom={12} scrollWheelZoom={false} className="size-full" attributionControl>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="sh-tiles"
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
