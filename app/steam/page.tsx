import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Steam game',
  description: 'Space shooter in development — details coming soon.',
})

export default function SteamPage() {
  return (
    <div className="divide-turquoise-surf-200/60 divide-y">
      <div className="cyber-main-surface space-y-4 p-6 pt-8 pb-10 md:p-10">
        <h1 className="font-heading text-pale-sky-950 text-3xl font-extrabold tracking-tight md:text-4xl">
          Steam game
        </h1>
        <p className="text-pale-sky-800 max-w-2xl text-lg leading-relaxed">
          Content for the game I&apos;m working on will go here — screenshots, Steam link, and pitch
          — when it&apos;s ready.
        </p>
      </div>
    </div>
  )
}
