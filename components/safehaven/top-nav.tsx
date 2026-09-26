import { ArrowUpRight, ShieldCheck } from 'lucide-react'

export function TopNav() {
  return (
    <header className="sticky top-0 z-[1100] border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
          <h1 className="text-base font-semibold tracking-tight">SafeHaven NC</h1>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Storm readiness for Orange, Durham &amp; Wake counties
          </span>
        </div>
        <a
          href="https://www.readync.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Official alerts
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
          <span className="sr-only">(ReadyNC, opens in a new tab)</span>
        </a>
      </div>
    </header>
  )
}
