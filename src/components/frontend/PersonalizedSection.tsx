'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt: string
  featuredImage?: {
    url: string
    alt?: string
  }
  category?: {
    id: string
    name: string
    slug: string
    color?: string
  }
  author?: {
    name: string
    avatar?: {
      url: string
    }
  }
  readTime?: number
}

export default function PersonalizedSection() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [hasInterests, setHasInterests] = useState(false)

  useEffect(() => {
    if (user) {
      fetchPersonalizedPosts()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchPersonalizedPosts = async () => {
    try {
      // First check if user has interested categories
      const userResponse = await fetch('/api/users/me', {
        credentials: 'include',
      })

      if (!userResponse.ok) {
        setLoading(false)
        return
      }

      const userData = await userResponse.json()
      const interestedCategories = userData.user?.interestedCategories || []

      if (interestedCategories.length === 0) {
        setHasInterests(false)
        setLoading(false)
        return
      }

      setHasInterests(true)

      // Get category IDs
      const categoryIds = interestedCategories.map((cat: any) =>
        typeof cat === 'object' ? cat.id : cat
      )

      // Fetch posts from interested categories
      const postsResponse = await fetch(
        `/api/posts?where[status][equals]=published&where[category][in]=${categoryIds.join(',')}&limit=8&sort=-publishedAt&depth=2`,
        { credentials: 'include' }
      )

      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setPosts(postsData.docs || [])
      }
    } catch (error) {
      console.error('Failed to fetch personalized posts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Don't show section if not logged in or no interests
  if (!user || loading) {
    return null
  }

  if (!hasInterests || posts.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">For You</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Based on your interests</p>
          </div>
        </div>
        <Link
          href="/settings/interests"
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Manage Interests</span>
        </Link>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.slice(0, 8).map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700"
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                {post.featuredImage?.url ? (
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {post.title.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Category Badge */}
                {post.category && (
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
                      style={{ backgroundColor: post.category.color || '#6366f1' }}
                    >
                      {post.category.name}
                    </span>
                  </div>
                )}
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/blog/${post.slug}`}>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
              </Link>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                {post.readTime && <span>{post.readTime} min read</span>}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  )
}
