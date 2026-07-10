// src/payload.config.ts - Payload 3.x Complete Config with Dashboard
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Media } from './collections/Media'
import { Comments } from './collections/Comments'
import { Bookmarks } from './collections/Bookmarks'
import { SearchQueries } from './collections/SearchQueries'
import { PostViews } from './collections/PostViews'
import { ReadingProgress } from './collections/ReadingProgress'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { PostReactions } from './collections/PostReactions'
import { DeletionFeedback } from './collections/DeletionFeedback'
import { VisitorSessions } from './collections/VisitorSessions'
import { PageViews } from './collections/PageViews'
import { LogoutFeedback } from './collections/LogoutFeedback'

// Globals
import { SiteSettings } from './globals/SiteSettings'

// Endpoints
import { searchEndpoint } from './endpoints/search'
import { trendingEndpoint } from './endpoints/trending'
import { relatedEndpoint } from './endpoints/related'
import { incrementViewsEndpoint } from './endpoints/increment-views'
import { toggleBookmarkEndpoint } from './endpoints/toggle-bookmark'
import { readingProgressEndpoint } from './endpoints/reading-progress'
import { dashboardStatsEndpoint } from './endpoints/dashboard-stats'
import { getCommentsEndpoint } from './endpoints/get-comments'
import { createCommentEndpoint } from './endpoints/create-comment'
import { analyticsStatsEndpoint } from './endpoints/analytics-stats'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Allow both the www and non-www variants of the server URL for CORS/CSRF so
// the admin panel works regardless of which host the user visits. Without this,
// requests from the non-canonical host are rejected with "You are not allowed
// to perform this action".
const buildAllowedOrigins = (url: string): string[] => {
  try {
    const u = new URL(url)
    const origins = new Set<string>([`${u.protocol}//${u.host}`])
    if (u.host.startsWith('www.')) {
      origins.add(`${u.protocol}//${u.host.replace(/^www\./, '')}`)
    } else {
      origins.add(`${u.protocol}//www.${u.host}`)
    }
    return Array.from(origins)
  } catch {
    return [url]
  }
}

const allowedOrigins = buildAllowedOrigins(serverURL)

export default buildConfig({
  admin: {
    css: [
      path.resolve(__dirname, './styles/admin-overrides.css'),
    ],
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Yarqa Tech Blog',
      ogImage: '/og-image.jpg',
    },
    autoLogin: false,
    components: {
      views: {
        dashboard: {
          Component: '@/components/Dashboard',
        },
      },
      graphics: {
        Icon: '@/components/admin/Logo',
        Logo: '@/components/admin/Logo',
      },
    },
    livePreview: {
      collections: ['posts', 'pages'],
    },
  } as any,
  collections: [
    Users,
    Media,
    Categories,
    Tags,
    Posts,
    Pages,
    Comments,
    Bookmarks,
    SearchQueries,
    PostViews,
    ReadingProgress,
    NewsletterSubscribers,
    PostReactions,
    DeletionFeedback,
    VisitorSessions,
    PageViews,
    LogoutFeedback,
  ],
  globals: [SiteSettings],
  endpoints: [
    searchEndpoint,
    trendingEndpoint,
    relatedEndpoint,
    incrementViewsEndpoint,
    toggleBookmarkEndpoint,
    readingProgressEndpoint,
    dashboardStatsEndpoint,
    getCommentsEndpoint,
    createCommentEndpoint,
    analyticsStatsEndpoint,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  cors: allowedOrigins,
  csrf: allowedOrigins,
})
