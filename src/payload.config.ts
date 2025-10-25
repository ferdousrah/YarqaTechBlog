// src/payload.config.ts - Payload 3.x Complete Config
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Media } from './collections/Media'
import { Comments } from './collections/Comments'
import { Bookmarks } from './collections/Bookmarks'
import { SearchQueries } from './collections/SearchQueries'
import { PostViews } from './collections/PostViews'
import { ReadingProgress } from './collections/ReadingProgress'

// Endpoints
//import { searchEndpoint } from './endpoints/search'
//import { trendingEndpoint } from './endpoints/trending'
//import { relatedEndpoint } from './endpoints/related'
//import { incrementViewsEndpoint } from './endpoints/increment-views'
//import { toggleBookmarkEndpoint } from './endpoints/toggle-bookmark'
//import { readingProgressEndpoint } from './endpoints/reading-progress'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Yarqa Tech Blog',
      //favicon: '/favicon.ico',
      //ogImage: '/og-image.jpg',
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Tags,
    Posts,
    Comments,
    Bookmarks,
    SearchQueries,
    PostViews,
    ReadingProgress,
  ],
  endpoints: [
    //searchEndpoint,
    //trendingEndpoint,
    //relatedEndpoint,
    //incrementViewsEndpoint,
    //toggleBookmarkEndpoint,
    //readingProgressEndpoint,
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
