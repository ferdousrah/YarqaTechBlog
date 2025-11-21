// src/app/(frontend)/blog/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams
  const payload = await getPayload({ config })
  const page = Number(pageParam) || 1
  const limit = 12

  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    limit,
    page,
    sort: '-publishedAt',
  })

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Latest Articles</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover the latest in technology, development, and innovation
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.docs.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
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
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-6xl font-bold text-white">{post.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Link
                    href={`/category/${typeof post.category === 'object' ? post.category.slug : ''}`}
                    className="text-blue-600 font-bold text-xs uppercase hover:underline"
                  >
                    {typeof post.category === 'object' ? post.category.name : ''}
                  </Link>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>By {typeof post.author === 'object' ? post.author.name : ''}</span>
                    {post.readTime && (
                      <>
                        <span>•</span>
                        <span>{post.readTime} min read</span>
                      </>
                    )}
                  </div>
                  {post.views > 0 && (
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
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
            {/* Previous Button */}
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}`}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-gray-900 dark:text-white"
              >
                ← Previous
              </Link>
            )}

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: posts.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/blog?page=${pageNum}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition ${
                    pageNum === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {pageNum}
                </Link>
              ))}
            </div>

            {/* Next Button */}
            {page < posts.totalPages && (
              <Link
                href={`/blog?page=${page + 1}`}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-gray-900 dark:text-white"
              >
                Next →
              </Link>
            )}
          </div>
        )}

        {/* Empty State */}
        {posts.docs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No posts yet</h2>
            <p className="text-gray-600 dark:text-gray-400">Check back later for new content!</p>
          </div>
        )}
      </div>
    </div>
  )
}
