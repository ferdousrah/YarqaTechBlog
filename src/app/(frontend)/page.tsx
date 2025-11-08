// src/app/(frontend)/page.tsx - Modern design with animations
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  AnimatedHeroPost,
  AnimatedSmallPost,
  AnimatedPostCard,
  AnimatedSectionHeader,
  AnimatedContainer,
} from '@/components/AnimatedComponents'
import NewsletterWrapper from '@/components/frontend/NewsletterWrapper'

export default async function HomePage() {
  const payload = await getPayload({ config })

  // Fetch latest posts
  const latestPosts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    limit: 15,
    sort: '-publishedAt',
  })

  const heroPost = latestPosts.docs[0]
  const topStories = latestPosts.docs.slice(1, 5)
  const trendingPosts = latestPosts.docs.slice(5, 9)
  const latestNews = latestPosts.docs.slice(9, 15)

  // Fetch categories for sections
  const categories = await payload.find({
    collection: 'categories',
    limit: 10,
    sort: 'order',
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Main Container */}
      <AnimatedContainer className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Large Post with 4 smaller posts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Large Hero Post - 2 columns */}
          {heroPost && <AnimatedHeroPost post={heroPost} />}

          {/* 4 Smaller Posts - 1 column */}
          <div className="flex flex-col gap-4">
            {topStories.map((post, index) => (
              <AnimatedSmallPost key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <div className="mb-16">
          <AnimatedSectionHeader
            title="Trending Now"
            link={{ href: '/blog', label: 'View All' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPosts.map((post, index) => (
              <AnimatedPostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>

        {/* Latest News Section */}
        <div className="mb-16">
          <AnimatedSectionHeader
            title="Latest Articles"
            link={{ href: '/blog', label: 'View All' }}
          />

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
            <div className="space-y-6">
              {latestNews.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-5 pb-6 border-b border-gray-100 last:border-0 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-300 p-4 -m-4 rounded-xl"
                >
                  {/* Image */}
                  <div className="relative w-40 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 shadow-md">
                    {typeof post.featuredImage === 'object' && post.featuredImage?.url ? (
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                        <span className="text-4xl font-bold text-blue-600">{post.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 font-bold text-xs uppercase tracking-wide">
                        {typeof post.category === 'object' ? post.category.name : ''}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Category Sections */}
        {categories.docs.slice(0, 3).map((category) => (
          <CategorySection key={category.id} category={category} payload={payload} />
        ))}
      </AnimatedContainer>

      {/* Newsletter Section */}
      <NewsletterWrapper />
    </div>
  )
}

// Category Section Component
async function CategorySection({ category, payload }: any) {
  const categoryPosts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
      category: { equals: category.id },
    },
    limit: 2,
    sort: '-publishedAt',
  })

  if (categoryPosts.docs.length === 0) return null

  const borderColor = category.color || '#2563eb' // Default blue-600

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{category.name}</h2>
          <div className="h-1 w-20 rounded-full" style={{ background: borderColor }}></div>
        </div>
        <Link
          href={`/category/${category.slug}`}
          className="font-semibold text-sm hover:opacity-80 transition flex items-center gap-2 group"
          style={{ color: borderColor }}
        >
          View All
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryPosts.docs.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group">
            <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full border border-gray-100">
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {typeof post.featuredImage === 'object' && post.featuredImage?.url ? (
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <span className="text-6xl font-bold text-blue-600">{post.title.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: borderColor }}>
                  {category.name}
                </div>
                <h3 className="font-bold text-2xl text-gray-900 group-hover:opacity-80 transition mb-3 line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {typeof post.author === 'object' ? post.author.name.charAt(0) : 'A'}
                    </div>
                    <span>{typeof post.author === 'object' ? post.author.name : ''}</span>
                  </div>
                  <span>•</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}
