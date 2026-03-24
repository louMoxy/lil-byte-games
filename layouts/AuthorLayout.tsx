import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  return (
    <>
      <div className="divide-turquoise-surf-200/60 divide-y">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="font-heading text-pale-sky-950 text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
          <div className="flex flex-col items-center space-x-2 pt-8">
            {avatar && (
              <Image
                src={avatar}
                alt="avatar"
                width={192}
                height={192}
                className="h-48 w-48 rounded-full"
              />
            )}
            <h3 className="font-heading pt-4 pb-2 text-2xl leading-8 font-bold tracking-tight">
              {name}
            </h3>
            <div className="text-pale-sky-700">{occupation}</div>
            <div className="text-pale-sky-700">{company}</div>
            {/* <div className="flex space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter} />
              <SocialIcon kind="bluesky" href={bluesky} />
            </div> */}
          </div>
          <div className="prose glass-panel border-turquoise-surf-200/80 mt-4 max-w-none rounded-lg border-2 p-3 pt-8 pb-8 shadow-md xl:col-span-2">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
