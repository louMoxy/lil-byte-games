import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="border-turquoise-surf-200/70 mt-10 border-t pt-10">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          {siteMetadata.email && (
            <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
          )}
          {siteMetadata.github && <SocialIcon kind="github" href={siteMetadata.github} size={6} />}
          {siteMetadata.facebook && (
            <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
          )}
          {siteMetadata.youtube && (
            <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
          )}
          {siteMetadata.linkedin && (
            <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          )}
          {siteMetadata.twitter && (
            <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
          )}
          {siteMetadata.bluesky && (
            <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={6} />
          )}
          {siteMetadata.x && <SocialIcon kind="x" href={siteMetadata.x} size={6} />}
          {siteMetadata.instagram && (
            <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
          )}
          {siteMetadata.threads && (
            <SocialIcon kind="threads" href={siteMetadata.threads} size={6} />
          )}
          {siteMetadata.medium && <SocialIcon kind="medium" href={siteMetadata.medium} size={6} />}
        </div>
        <div className="text-pale-sky-700 mb-2 flex space-x-2 text-sm">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  )
}
