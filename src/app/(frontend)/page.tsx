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
          <ArticleCardWithBookmark
            key={post.id}
            post={post}
            variant="card"
            borderColor={borderColor}
          />
        ))}
      </div>
    </div>
  )
}
