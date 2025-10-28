// src/app/(frontend)/page.tsx - Pure Tailwind CSS
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'

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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Large Post with 4 smaller posts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Large Hero Post - 2 columns */}
          {heroPost && (
            <div className="lg:col-span-2">
              <Link href={`/blog/${heroPost.slug}`} className="group block">
                <article className="relative h-[600px] rounded-2xl overflow-hidden bg-gray-900 shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                  {/* Featured Image */}
                  {typeof heroPost.featuredImage === 'object' && heroPost.featuredImage?.url && (
                    <Image
                      src={heroPost.featuredImage.url}
                      alt={heroPost.featuredImage.alt || heroPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                  )}

                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg">
                        {typeof heroPost.category === 'object' ? heroPost.category.name : ''}
                      </span>
                      <span className="text-gray-200 text-sm font-medium">
                        {new Date(heroPost.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight group-hover:text-blue-300 transition-colors duration-300">
                      {heroPost.title}
                    </h2>
                    <p className="text-xl text-gray-100 mb-5 line-clamp-2 leading-relaxed">
                      {heroPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {typeof heroPost.author === 'object' ? heroPost.author.name.charAt(0) : 'A'}
                        </div>
                        <span className="font-medium">
                          {typeof heroPost.author === 'object' ? heroPost.author.name : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          )}

          {/* 4 Smaller Posts - 1 column */}
          <div className="flex flex-col gap-4">
            {topStories.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <article className="relative h-[140px] rounded-xl overflow-hidden bg-gray-900 shadow-lg transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
                  {/* Featured Image */}
                  {typeof post.featuredImage === 'object' && post.featuredImage?.url && (
                    <Image
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt || post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="text-xs font-bold mb-2 text-blue-300 uppercase tracking-wide">
                      {typeof post.category === 'object' ? post.category.name : ''}
                    </div>
                    <h3 className="font-bold text-sm line-clamp-2 group-hover:text-blue-200 transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Trending Now</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
            </div>
            <Link
              href="/blog"
              className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition flex items-center gap-2 group"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPosts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full border border-gray-100">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {typeof post.featuredImage === 'object' && post.featuredImage?.url ? (
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                        <span className="text-5xl font-bold text-blue-600">{post.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
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
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest News Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Latest Articles</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
            </div>
            <Link
              href="/blog"
              className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition flex items-center gap-2 group"
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
      </div>

      {/* Newsletter Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Newsletter
            </div>

            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Stay in the Loop
            </h3>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Get the latest tech insights, tutorials, and industry news delivered straight to your inbox. Join 10,000+ developers and tech enthusiasts!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 rounded-xl focus:outline-none focus:border-white focus:bg-white/20 transition"
              />
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition transform hover:scale-105 shadow-xl whitespace-nowrap">
                Subscribe Now
              </button>
            </div>

            <p className="text-blue-200 text-sm mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
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
