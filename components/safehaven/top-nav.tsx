import { CloudRain, Radio, ShieldCheck, Building } from 'lucide-react'

const STAT_BADGES = [
  { label: 'NOAA Calibrated (2000–2026)', icon: CloudRain },
  { label: 'FEMA BCAT Hazard Codes Active', icon: Building },
  { label: 'Live Forecast Synchronized', icon: Radio },
]

export function TopNav() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70 sticky top-0 z-[1100]">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-emerald-500 text-slate-950">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <h1 className="text-lg font-semibold tracking-tight text-slate-50">SafeHaven NC</h1>
              <p className="text-xs text-slate-400">Disaster Resilience &amp; Adaptive Shelter Router</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Central NC / Triangle Emergency Resilience System
          </span>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="System status">
          {STAT_BADGES.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300"
            >
              <Icon className="size-3.5 text-emerald-400" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
