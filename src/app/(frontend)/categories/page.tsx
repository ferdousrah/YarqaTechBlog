// src/app/(frontend)/categories/page.tsx
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export const metadata = {
  title: 'Categories - Yarqa Tech Blog',
  description: 'Browse all categories and discover content that interests you',
}

export default async function CategoriesPage() {
  const payload = await getPayload({ config })

  // Get all parent categories
  const parentCategories = await payload.find({
    collection: 'categories',
    where: {
      parent: { exists: false },
    },
    limit: 100,
    sort: 'order',
  })

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Browse Categories</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our content organized by topics that interest you
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parentCategories.docs.map((category) => (
            <CategoryCard key={category.id} category={category} payload={payload} />
          ))}
        </div>

        {/* Empty State */}
        {parentCategories.docs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📂</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No categories yet</h2>
            <p className="text-gray-600">Categories will appear here once they're created</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Category Card Component
async function CategoryCard({ category, payload }: any) {
  // Get actual post count
  const postsCount = await payload.count({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
      category: { equals: category.id },
    },
  })

  // Get subcategories
  const subcategories = await payload.find({
    collection: 'categories',
    where: {
      parent: { equals: category.id },
    },
    limit: 5,
  })

  const categoryColor = category.color || '#3B82F6'

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
    >
      {/* Header with color */}
      <div
        className="p-8 text-white relative overflow-hidden"
        style={{ backgroundColor: categoryColor }}
      >
        <div className="relative z-10">
          {category.icon && <div className="text-5xl mb-3">{getCategoryIcon(category.icon)}</div>}
          <h2 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform">
            {category.name}
          </h2>
          <p className="text-sm opacity-90">
            {postsCount.totalDocs} {postsCount.totalDocs === 1 ? 'article' : 'articles'}
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        {category.description && (
          <p className="text-gray-600 mb-4 line-clamp-3">{category.description}</p>
        )}

        {/* Subcategories */}
        {subcategories.docs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Subcategories</p>
            <div className="flex flex-wrap gap-2">
              {subcategories.docs.map((subcat: any) => (
                <span
                  key={subcat.id}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {subcat.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
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
