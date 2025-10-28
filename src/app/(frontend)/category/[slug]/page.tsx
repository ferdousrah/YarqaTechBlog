// src/app/(frontend)/category/[slug]/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
  })

  return categories.docs.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'categories',
    where: {
      slug: { equals: params.slug },
    },
    limit: 1,
  })

  if (!result.docs.length) {
    return {
      title: 'Category Not Found',
    }
  }

  const category = result.docs[0]

  return {
    title: `${category.name} - Yarqa Tech Blog`,
    description: category.description || `Browse all articles in ${category.name}`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { page?: string }
}) {
  const payload = await getPayload({ config })
  const page = Number(searchParams.page) || 1
  const limit = 12

  // Get category
  const categoryResult = await payload.find({
    collection: 'categories',
    where: {
      slug: { equals: params.slug },
    },
    limit: 1,
  })

  if (!categoryResult.docs.length) {
    notFound()
  }

  const category = categoryResult.docs[0]

  // Get posts in this category
  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
      category: { equals: category.id },
    },
    limit,
    page,
    sort: '-publishedAt',
  })

  // Get subcategories if any
  const subcategories = await payload.find({
    collection: 'categories',
    where: {
      parent: { equals: category.id },
    },
    limit: 20,
  })

  const categoryColor = category.color || '#3B82F6'

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Category Header */}
      <div
        className="py-16 text-white relative overflow-hidden"
        style={{ backgroundColor: categoryColor }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Category Icon */}
            {category.icon && <div className="text-6xl mb-4">{getCategoryIcon(category.icon)}</div>}

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Link href="/" className="hover:underline opacity-90">
                Home
              </Link>
              <span className="opacity-70">/</span>
              <Link href="/categories" className="hover:underline opacity-90">
                Categories
              </Link>
              <span className="opacity-70">/</span>
              <span className="font-semibold">{category.name}</span>
            </div>

            <h1 className="text-5xl font-bold mb-4">{category.name}</h1>

            {category.description && (
              <p className="text-xl opacity-90 leading-relaxed">{category.description}</p>
            )}

            <div className="mt-6 flex items-center gap-4 text-sm opacity-90">
              <span>
                {posts.totalDocs} {posts.totalDocs === 1 ? 'article' : 'articles'}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Subcategories */}
        {subcategories.docs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Subcategories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {subcategories.docs.map((subcat) => (
                <Link
                  key={subcat.id}
                  href={`/category/${subcat.slug}`}
                  className="bg-white p-4 rounded-xl text-center hover:shadow-lg transition group"
                >
                  <div className="text-3xl mb-2">{getCategoryIcon(subcat.icon)}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition text-sm">
                    {subcat.name}
                  </h3>
                  {subcat.postCount > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{subcat.postCount} posts</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {posts.docs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.docs.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative h-56 bg-gray-200">
                      {typeof post.featuredImage === 'object' && post.featuredImage?.url ? (
                        <Image
                          src={post.featuredImage.url}
                          alt={post.featuredImage.alt || post.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(to bottom right, ${categoryColor}, ${adjustColor(categoryColor, -20)})`,
                          }}
                        >
                          <span className="text-6xl font-bold text-white">
                            {post.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-xs font-bold uppercase"
                        style={{ color: categoryColor }}
                      >
                        {category.name}
                      </span>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition mb-3 line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>By {typeof post.author === 'object' ? post.author.name : ''}</span>
                        {post.readTime && (
                          <>
                            <span>•</span>
                            <span>{post.readTime} min read</span>
                          </>
                        )}
                      </div>
                      {post.views > 0 && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span>{post.views}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {posts.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/category/${params.slug}?page=${page - 1}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    ← Previous
                  </Link>
                )}

                <div className="flex gap-2">
                  {Array.from({ length: posts.totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/category/${params.slug}?page=${pageNum}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition ${
                        pageNum === page
                          ? 'text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                      style={pageNum === page ? { backgroundColor: categoryColor } : {}}
                    >
                      {pageNum}
                    </Link>
                  ))}
                </div>

                {page < posts.totalPages && (
                  <Link
                    href={`/category/${params.slug}?page=${page + 1}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No articles yet</h2>
            <p className="text-gray-600 mb-6">
              Check back later for new content in {category.name}
            </p>
            <Link
              href="/blog"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse All Articles
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function for category icons
function getCategoryIcon(icon?: string) {
  const icons: Record<string, string> = {
    code: '💻',
    mobile: '📱',
    cloud: '☁️',
    database: '🗄️',
    security: '🔒',
    ai: '🤖',
    design: '🎨',
    business: '💼',
    tutorial: '📚',
    news: '📰',
  }
  return icons[icon || 'code'] || '📝'
}

// Helper function to darken color
function adjustColor(color: string, amount: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount))
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
