'use client'

import { Hero3D } from '@/components/Hero3D'

export function SiteBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 h-[100dvh] min-h-screen w-full overflow-hidden"
      aria-hidden
    >
      <Hero3D className="h-full min-h-[100dvh]" variant="background" />
    </div>
  )
}
