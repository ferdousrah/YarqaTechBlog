// src/app/(frontend)/tags/page.tsx
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export const metadata = {
  title: 'Tags - Yarqa Tech Blog',
  description: 'Browse all tags and discover content',
}

export default async function TagsPage() {
  const payload = await getPayload({ config })

  // Get all tags with usage count
  const tags = await payload.find({
    collection: 'tags',
    limit: 200,
    sort: '-usageCount',
  })

  // Get actual post count for each tag
  const tagsWithCounts = await Promise.all(
    tags.docs.map(async (tag) => {
      const count = await payload.count({
        collection: 'posts',
        where: {
          status: { equals: 'published' },
          tags: { in: [tag.id] },
        },
      })
      return { ...tag, actualCount: count.totalDocs }
    }),
  )

  // Filter out tags with no posts and sort by count
  const activeTags = tagsWithCounts
    .filter((tag) => tag.actualCount > 0)
    .sort((a, b) => b.actualCount - a.actualCount)

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Browse Tags</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore topics and discover content through our tag collection
          </p>
        </div>

        {/* Tags Cloud */}
        {activeTags.length > 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="flex flex-wrap gap-3 justify-center">
              {activeTags.map((tag) => {
                const tagColor = tag.color || '#6366F1'
                // Size based on usage
                const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl']
                const sizeIndex = Math.min(Math.floor(tag.actualCount / 2), sizes.length - 1)
                const textSize = sizes[sizeIndex]

                return (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className={`${textSize} font-semibold px-4 py-2 rounded-full hover:shadow-lg transition-all hover:scale-110`}
                    style={{
                      backgroundColor: `${tagColor}20`,
                      color: tagColor,
                      borderWidth: '2px',
                      borderColor: tagColor,
                    }}
                  >
                    #{tag.name} ({tag.actualCount})
                  </Link>
                )
              })}
            </div>
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏷️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No tags yet</h2>
            <p className="text-gray-600">Tags will appear here once content is tagged</p>
          </div>
        )}

        {/* Popular Tags Section */}
        {activeTags.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Popular Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTags.slice(0, 9).map((tag) => {
                const tagColor = tag.color || '#6366F1'
                return (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                          style={{ backgroundColor: tagColor }}
                        >
                          #
                        </div>
                        <div>
                          <h3
                            className="font-bold text-lg group-hover:underline"
                            style={{ color: tagColor }}
                          >
                            {tag.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {tag.actualCount} {tag.actualCount === 1 ? 'article' : 'articles'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {tag.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">{tag.description}</p>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-xl mb-8 opacity-90">
            Try browsing by categories or use our search function
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/categories"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Browse Categories
            </Link>
            <Link
              href="/search"
              className="px-8 py-4 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition border-2 border-white"
            >
              Search Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
