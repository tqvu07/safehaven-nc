'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { HIGH_CAPACITY_THRESHOLD } from '@/lib/safehaven/data'
import type { ApiShelter } from '@/lib/safehaven/api'

const PRIMARY = '#1d4ed8'

function shelterIcon(highCapacity: boolean, selected: boolean, status: 'green' | 'amber' | 'red' = 'green') {
  const size = (highCapacity ? 18 : 14) + (selected ? 6 : 0)
  const fill = status === 'red' ? '#dc2626' : status === 'amber' ? '#f59e0b' : highCapacity ? PRIMARY : '#ffffff'
  const border = status === 'red' ? '#7f1d1d' : status === 'amber' ? '#92400e' : highCapacity ? '#ffffff' : PRIMARY
  const ring = selected ? `box-shadow:0 0 0 4px rgb(29 78 216 / .25),0 1px 3px rgb(0 0 0 / .3);` : 'box-shadow:0 1px 3px rgb(0 0 0 / .3);'
  return L.divIcon({
    className: 'sh-marker',
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${fill};border:${highCapacity ? '2px solid #fff' : `3px solid ${border}`};${ring}"></div>`,
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

function FitBounds({ user, shelters }: { user: [number, number]; shelters: ApiShelter[] }) {
  const map = useMap()
  useEffect(() => {
    const nearest = shelters.slice(0, 6).map((s) => [s.lat, s.lon] as [number, number])
    const bounds = L.latLngBounds([user, ...nearest])
    map.flyToBounds(bounds.pad(0.15), { maxZoom: 13, duration: 0.8 })
  }, [map, user, shelters])
  return null
}

interface ShelterMapProps {
  user: [number, number]
  shelters: ApiShelter[]
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
        const selected = s.name === selectedId
        const capacity = Number(s.evacuation_capacity ?? s.capacity ?? 0)
        const totalPopulation = Number(s.total_population ?? 0)
        const occupancy = capacity > 0 ? Math.round((totalPopulation / capacity) * 100) || 0 : 0
        const status = (s.shelter_status ?? '').trim().toUpperCase()
        const markerStatus = status === 'FULL' || occupancy > 90 ? 'red' : occupancy >= 70 ? 'amber' : 'green'
        return (
          <Marker
            key={s.name}
            position={[s.lat, s.lon]}
            icon={high ? (selected ? shelterIcon(true, true, markerStatus) : shelterIcon(true, false, markerStatus)) : selected ? shelterIcon(false, true, markerStatus) : shelterIcon(false, false, markerStatus)}
            zIndexOffset={selected ? 900 : 0}
            eventHandlers={{
              click: (event) => {
                event.originalEvent?.preventDefault?.()
                event.originalEvent?.stopPropagation?.()
                if (!(status === 'FULL' || occupancy > 90)) onSelect(s.name)
              },
            }}
            title={s.name}
            alt={s.name}
            keyboard
          >
            <Tooltip direction="top" offset={[0, -14]}>
              {s.name}
              {status === 'FULL' ? ' · At Capacity' : ''}
            </Tooltip>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
