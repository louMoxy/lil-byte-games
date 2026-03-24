import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'

const Header = () => {
  let headerClass =
    'flex w-full items-center justify-between border-b border-turquoise-surf-200/70 pb-6'
  if (siteMetadata.stickyNav) {
    headerClass +=
      ' sticky top-0 z-50 -mx-4 rounded-t-[inherit] bg-pale-sky-50/90 px-4 pt-4 backdrop-blur-md sm:-mx-6 sm:px-6 md:-mx-8 md:px-8'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="font-heading text-pale-sky-900 hidden h-6 text-2xl font-semibold tracking-tight sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-pale-sky-900 hover:text-primary-600 m-1 font-medium"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
