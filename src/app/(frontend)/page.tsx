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
import { ArticleCardWithBookmark } from '@/components/ArticleCardWithBookmark'

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
    depth: 2, // Populate author.avatar and other nested relationships
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
                <ArticleCardWithBookmark key={post.id} post={post} variant="list" />
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
    limit: 6,
    sort: '-publishedAt',
    depth: 2,
  })

  if (categoryPosts.docs.length === 0) return null

  const borderColor = category.color || '#2563eb' // Default blue-600
  const featuredPost = categoryPosts.docs[0]
  const sidebarPosts = categoryPosts.docs.slice(1, 6)

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Featured Post (Large) */}
        <div className="lg:col-span-2">
          <ArticleCardWithBookmark
            post={featuredPost}
            variant="card"
            borderColor={borderColor}
          />
        </div>

        {/* Right Column - Small Posts List */}
        <div className="space-y-4">
          {sidebarPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex gap-4 bg-white rounded-lg p-4 hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              {/* Small Thumbnail */}
              {typeof post.featuredImage === 'object' && post.featuredImage?.url ? (
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{post.title.charAt(0)}</span>
                </div>
              )}

              {/* Title */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-tight mb-1">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
