'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Loader2, X, FileText, Calendar, User as UserIcon, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface BookmarkedPost {
  id: string
  post: {
    id: string
    title: string
    slug: string
    excerpt: string
    featuredImage?: {
      url: string
      alt?: string
    }
    publishedAt: string
    category?: {
      name: string
      slug: string
    }
    author?: {
      name: string
    }
  }
  note?: string
  createdAt: string
}

export default function BookmarksPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Fetch bookmarks
  useEffect(() => {
    if (user) {
      fetchBookmarks()
    }
  }, [user])

  const fetchBookmarks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/bookmarks')
      const data = await response.json()

      if (data.success) {
        setBookmarks(data.bookmarks)
      } else {
        setError(data.error || 'Failed to load bookmarks')
      }
    } catch (error) {
      setError('An error occurred while loading bookmarks')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveBookmark = async (bookmarkId: string) => {
    try {
      const response = await fetch(`/api/user/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId))
      } else {
        setError(data.error || 'Failed to remove bookmark')
      }
    } catch (error) {
      setError('An error occurred while removing bookmark')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/50">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Bookmarks</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {bookmarks.length} saved {bookmarks.length === 1 ? 'article' : 'articles'}
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Empty State */}
        {bookmarks.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
              <Bookmark className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No bookmarks yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start saving articles to read later by clicking the bookmark icon on any post
            </p>
            <Link
              href="/blog"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              Browse Articles
            </Link>
          </motion.div>
        )}

        {/* Bookmarks Grid */}
        <AnimatePresence mode="popLayout">
          {bookmarks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookmarks.map((bookmark, index) => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group"
                >
                  <Link href={`/blog/${bookmark.post.slug}`} className="block">
                    {/* Featured Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      {bookmark.post.featuredImage?.url ? (
                        <Image
                          src={bookmark.post.featuredImage.url}
                          alt={bookmark.post.featuredImage.alt || bookmark.post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                        </div>
                      )}

                      {/* Remove Bookmark Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleRemoveBookmark(bookmark.id)
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-all group/btn"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/btn:text-red-600 transition-colors" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Category & Date */}
                      <div className="flex items-center gap-3 mb-3 text-xs">
                        {bookmark.post.category && (
                          <>
                            <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide">
                              {bookmark.post.category.name}
                            </span>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                          </>
                        )}
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(bookmark.post.publishedAt || bookmark.post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2 leading-tight">
                        {bookmark.post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                        {bookmark.post.excerpt}
                      </p>

                      {/* Author */}
                      {bookmark.post.author && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <UserIcon className="w-4 h-4" />
                          <span>{bookmark.post.author.name}</span>
                        </div>
                      )}

                      {/* Note */}
                      {bookmark.note && (
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{bookmark.note}"</p>
                        </div>
                      )}

                      {/* Saved Date */}
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-700 mt-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Saved on{' '}
                          {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
