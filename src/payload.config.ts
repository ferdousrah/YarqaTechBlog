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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

import Dashboard from './components/Dashboard'

export default buildConfig({
  admin: {
    css: path.resolve(__dirname, './styles/admin-overrides.css'),
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Yarqa Tech Blog',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
    components: {
      views: {
        dashboard: {
          Component: Dashboard,
        },
      },
    },
  },
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
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(Boolean),
})
