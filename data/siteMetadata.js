/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Lil Byte Games',
  author: 'Louise',
  headerTitle: 'Lil Byte Games',
  description:
    'Indie game dev blog — building a space shooter around a day job, self-doubt, and caffeine. Updates every week.',
  language: 'en-us',
  /** Set to a blog post `slug` to pin it on the homepage, or leave empty */
  featuredPostSlug: '',
  siteUrl: 'https://tailwind-nextjs-starter-blog.vercel.app',
  siteRepo: 'https://github.com/timlrx/tailwind-nextjs-starter-blog',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  mastodon: 'https://mastodon.social/@mastodonuser',
  email: 'louisemoxy@gmail.com',
  github: 'https://github.com/louMoxy',
  // x: 'https://twitter.com/x',
  // facebook: 'https://facebook.com',
  // youtube: 'https://youtube.com',
  // linkedin: 'https://www.linkedin.com',
  // threads: 'https://www.threads.net',
  // instagram: 'https://www.instagram.com',
  // medium: 'https://medium.com',
  // bluesky: '',
  locale: 'en-US',
  stickyNav: false,
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: process.env.NEXT_UMAMI_ID,
    },
  },
  newsletter: {
    provider: 'buttondown',
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO || 'louMoxy/lil-byte-games',
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID || 'R_kgDORumOVg',
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Announcements',
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || 'DIC_kwDORumOVs4C5eOx',
      mapping: 'title',
      reactions: '1',
      metadata: '0',
      inputPosition: 'bottom',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
