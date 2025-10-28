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
  const latestNews = latestPosts.docs.slice(5, 15)

  // Fetch categories for sections
  const categories = await payload.find({
    collection: 'categories',
    limit: 10,
    sort: 'order',
  })

  return (
    <div className="bg-green-600 min-h-screen">
      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Large Post with 4 smaller posts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Large Hero Post - 2 columns */}
          {heroPost && (
            <div className="lg:col-span-2">
              <Link href={`/blog/${heroPost.slug}`} className="group block">
                <article className="relative h-[600px] rounded-xl overflow-hidden bg-gray-900">
                  {/* Featured Image */}
                  {typeof heroPost.featuredImage === 'object' && heroPost.featuredImage?.url && (
                    <Image
                      src={heroPost.featuredImage.url}
                      alt={heroPost.featuredImage.alt || heroPost.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded uppercase">
                        {typeof heroPost.category === 'object' ? heroPost.category.name : ''}
                      </span>
                      <span className="text-gray-300 text-sm">
                        {new Date(heroPost.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 group-hover:text-gray-300 transition">
                      {heroPost.title}
                    </h2>
                    <p className="text-xl text-gray-200 mb-4 line-clamp-2">{heroPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>
                        By {typeof heroPost.author === 'object' ? heroPost.author.name : ''}
                      </span>
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
                <article className="relative h-[140px] rounded-xl overflow-hidden bg-gray-900">
                  {/* Featured Image */}
                  {typeof post.featuredImage === 'object' && post.featuredImage?.url && (
                    <Image
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt || post.title}
                      fill
                      className="object-cover"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="text-xs font-bold mb-2 text-gray-300">
                      {typeof post.category === 'object' ? post.category.name.toUpperCase() : ''}
                    </div>
                    <h3 className="font-bold text-sm line-clamp-2 group-hover:text-gray-300 transition">
                      {post.title}
                    </h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest News Section - White Background */}
        <div className="bg-white rounded-xl p-8 mb-12 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-green-600">
            <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
            <Link href="/blog" className="text-green-600 font-bold text-sm hover:underline">
              VIEW ALL →
            </Link>
          </div>

          <div className="space-y-6">
            {latestNews.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 pb-6 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors p-2 rounded-lg"
              >
                {/* Image */}
                <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  {typeof post.featuredImage === 'object' && post.featuredImage?.url ? (
                    <Image
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                      <span className="text-3xl font-bold text-white">{post.title.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600 font-bold text-xs uppercase">
                      {typeof post.category === 'object' ? post.category.name : ''}
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Category Sections */}
        {categories.docs.slice(0, 3).map((category) => (
          <CategorySection key={category.id} category={category} payload={payload} />
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="bg-white border-t-4 border-green-600 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Newsletters</h3>
              <p className="text-gray-600">
                Subscribe to get the latest tech news delivered to your inbox
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 w-full md:w-80"
              />
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition whitespace-nowrap">
                Subscribe
              </button>
            </div>
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

  const borderColor = category.color || '#16a34a' // Default green-600

  return (
    <div className="bg-white rounded-xl p-8 mb-8 shadow-lg">
      <div
        className="flex items-center justify-between mb-6 pb-4 border-b-4"
        style={{ borderColor }}
      >
        <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
        <Link
          href={`/category/${category.slug}`}
          className="font-bold text-sm hover:underline"
          style={{ color: borderColor }}
        >
          VIEW ALL →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categoryPosts.docs.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group">
            <article>
              <div className="relative h-64 rounded-xl overflow-hidden mb-4 bg-gray-200">
                {typeof post.featuredImage === 'object' && post.featuredImage?.url ? (
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                    <span className="text-6xl font-bold text-white">{post.title.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="text-xs font-bold mb-2 uppercase" style={{ color: borderColor }}>
                {category.name}
              </div>
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-gray-600 transition mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3 mb-3">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>By {typeof post.author === 'object' ? post.author.name : ''}</span>
                <span>•</span>
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}
