import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const MAX_DISPLAY = 5

type Post = {
  slug: string
  date: string
  title: string
  summary?: string
  tags: string[]
}

export default function Home({ posts }: { posts: Post[] }) {
  const featuredSlug =
    typeof siteMetadata.featuredPostSlug === 'string' ? siteMetadata.featuredPostSlug.trim() : ''
  const featured = featuredSlug ? (posts.find((p) => p.slug === featuredSlug) ?? null) : null
  const listPosts = featured ? posts.filter((p) => p.slug !== featured.slug) : posts

  return (
    <>
      <div className="mt-12">
        <div className="glass-panel border-turquoise-surf-200/80 space-y-4 rounded-lg border-2 p-6 pt-8 pb-10 shadow-md md:space-y-6 md:p-10">
          <p className="cyber-muted text-[0.65rem]">Indie dev log // London</p>
          <h1 className="font-heading text-pale-sky-950 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl md:leading-tight">
            Hi, I&apos;m Louise. I&apos;ve been trying to become an indie game dev for 4 years. It
            hasn&apos;t gone well. I&apos;m not stopping.
          </h1>
          <p className="text-pale-sky-800 max-w-2xl text-lg leading-relaxed">
            Follow along as I build my first real game — a space shooter — around my day job, my
            self-doubt, and whatever caffeine I can get my hands on. Updates every week. Honesty
            guaranteed.
          </p>
        </div>

        {featured && (
          <div className="py-10">
            <div className="mb-4 flex items-center gap-2">
              <span className="border-turquoise-surf-400/80 bg-turquoise-surf-100/80 text-primary-800 rounded border px-2 py-0.5 font-mono text-xs font-semibold tracking-wider uppercase">
                Featured
              </span>
            </div>
            <article className="cyber-main-surface p-6 md:p-8">
              <dl>
                <dt className="sr-only">Published on</dt>
                <dd className="text-pale-sky-600 text-base font-medium">
                  <time dateTime={featured.date}>
                    {formatDate(featured.date, siteMetadata.locale)}
                  </time>
                </dd>
              </dl>
              <h2 className="font-heading text-pale-sky-950 mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                <Link href={`/blog/${featured.slug}`} className="hover:text-primary-700">
                  {featured.title}
                </Link>
              </h2>
              <p className="prose text-pale-sky-800 mt-4 max-w-none">{featured.summary ?? ''}</p>
              <div className="mt-4 text-base font-medium">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="text-primary-600 hover:text-primary-700"
                  aria-label={`Read featured post: "${featured.title}"`}
                >
                  Read post &rarr;
                </Link>
              </div>
            </article>
          </div>
        )}

        <div className="space-y-2 pt-8 pb-6 md:space-y-3">
          <h2 className="font-heading cyber-neon-section-title text-pale-sky-950 text-center text-2xl font-extrabold md:text-4xl">
            Latest posts
          </h2>
        </div>

        <ul className="divide-turquoise-surf-200/60 divide-y">
          {!listPosts.length && <li className="text-pale-sky-600 py-12">No posts found.</li>}
          {listPosts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="glass-panel border-turquoise-surf-200/80 space-y-2 rounded-lg border-2 p-3 shadow-md xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-pale-sky-600 text-base leading-6 font-medium">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="font-heading text-pale-sky-950 hover:text-primary-700"
                            >
                              {title}
                            </Link>
                          </h3>
                        </div>
                        <div className="prose text-pale-sky-700 max-w-none">{summary ?? ''}</div>
                      </div>
                      <div className="text-base leading-6 font-medium">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-600 hover:text-primary-700"
                          aria-label={`Read more: "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {listPosts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="text-primary-600 hover:text-primary-700"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}

      {/* Newsletter embed: replace this section when your provider snippet is ready */}
      <section
        id="newsletter"
        className="cyber-main-surface border-turquoise-surf-200/80 mt-12 border-t p-8 text-center"
        aria-labelledby="newsletter-heading"
      >
        <h2 id="newsletter-heading" className="font-heading text-pale-sky-950 text-xl font-bold">
          Newsletter
        </h2>
        <p className="text-pale-sky-700 mt-2 text-sm">Signup form coming soon...</p>
      </section>
    </>
  )
}
