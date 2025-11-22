// src/app/(frontend)/search/page.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<any>({ docs: [], totalDocs: 0, totalPages: 0, page: 1 })
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const query = searchParams.get('q') || ''
  const categoryFilter = searchParams.get('category') || ''
  const page = Number(searchParams.get('page')) || 1

  useEffect(() => {
    if (query.trim()) {
      fetchResults()
    }
  }, [query, categoryFilter, page])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchResults = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        query,
        ...(categoryFilter && { category: categoryFilter }),
        page: page.toString(),
        limit: '12',
      })

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?limit=50')
      const data = await response.json()
      setCategories(data.docs || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Search Results</h1>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category Filter */}
          {query && categories.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by category:</span>
              <Link
                href={`/search?q=${query}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  !categoryFilter
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/search?q=${query}&category=${cat.id}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    categoryFilter === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Results Info */}
        {query && !loading && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Found <span className="font-bold text-gray-900 dark:text-white">{results.totalDocs}</span>{' '}
              {results.totalDocs === 1 ? 'result' : 'results'} for{' '}
              <span className="font-bold text-gray-900 dark:text-white">"{query}"</span>
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Searching...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && query && results.docs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {results.docs.map((post: any) => (
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
                          <span className="text-6xl font-bold text-white">
                            {post.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Link
                        href={`/category/${typeof post.category === 'object' ? post.category.slug : ''}`}
                        className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase hover:underline"
                      >
                        {typeof post.category === 'object' ? post.category.name : ''}
                      </Link>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
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
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {results.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/search?q=${query}${categoryFilter ? `&category=${categoryFilter}` : ''}&page=${page - 1}`}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-gray-900 dark:text-white"
                  >
                    ← Previous
                  </Link>
                )}

                <div className="flex gap-2">
                  {Array.from({ length: results.totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/search?q=${query}${categoryFilter ? `&category=${categoryFilter}` : ''}&page=${pageNum}`}
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

                {page < results.totalPages && (
                  <Link
                    href={`/search?q=${query}${categoryFilter ? `&category=${categoryFilter}` : ''}&page=${page + 1}`}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-gray-900 dark:text-white"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && query && results.docs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No results found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try searching with different keywords or browse our{' '}
              <Link href="/categories" className="text-blue-600 dark:text-blue-400 hover:underline">
                categories
              </Link>
            </p>
          </div>
        )}

        {/* Initial State - No Query */}
        {!loading && !query && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Search Articles</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Enter keywords to search our content library</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/blog"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Browse All Articles
              </Link>
              <Link
                href="/categories"
                className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
