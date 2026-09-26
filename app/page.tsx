import { TopNav } from '@/components/safehaven/top-nav'
import { Dashboard } from '@/components/safehaven/dashboard'

export default function Page() {
  return (
    <>
      <TopNav />
      <main className="min-h-screen">
        <Dashboard />
      </main>
    </>
  )
}
