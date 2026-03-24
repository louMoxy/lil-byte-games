import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <div className="mb-6 px-4 py-6 sm:px-6 md:mb-8 md:px-8 md:py-8">{children}</div>
    </section>
  )
}
