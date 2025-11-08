'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bookmark, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface BookmarkButtonProps {
  postId: string
  initialBookmarked?: boolean
  variant?: 'default' | 'icon-only' | 'large'
  className?: string
  showLabel?: boolean
}

export default function BookmarkButton({
  postId,
  initialBookmarked = false,
  variant = 'default',
  className = '',
  showLabel = true,
}: BookmarkButtonProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  // Check bookmark status on mount
  useEffect(() => {
    if (user && postId) {
      checkBookmarkStatus()
    } else {
      setCheckingStatus(false)
    }
  }, [user, postId])

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/bookmark/status`)
      const data = await response.json()
      if (data.success) {
        setBookmarked(data.bookmarked)
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error)
    } finally {
      setCheckingStatus(false)
    }
  }

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      router.push('/login')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/posts/${postId}/bookmark`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setBookmarked(data.bookmarked)
      } else {
        console.error('Failed to toggle bookmark:', data.error)
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || checkingStatus) {
    return (
      <button
        disabled
        className={`inline-flex items-center gap-2 ${className}`}
      >
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </button>
    )
  }

  // Large variant - for blog post pages
  if (variant === 'large') {
    return (
      <motion.button
        onClick={handleToggleBookmark}
        whileHover={{ scale: loading ? 1 : 1.05 }}
        whileTap={{ scale: loading ? 1 : 0.95 }}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          bookmarked
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/50'
            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600'
        } ${className}`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
        )}
        {showLabel && (
          <span>{bookmarked ? 'Bookmarked' : 'Save for Later'}</span>
        )}
      </motion.button>
    )
  }

  // Icon-only variant - for compact spaces
  if (variant === 'icon-only') {
    return (
      <motion.button
        onClick={handleToggleBookmark}
        whileHover={{ scale: loading ? 1 : 1.1 }}
        whileTap={{ scale: loading ? 1 : 0.9 }}
        disabled={loading}
        title={bookmarked ? 'Remove bookmark' : 'Bookmark this post'}
        className={`p-2 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          bookmarked
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-600'
        } ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
        )}
      </motion.button>
    )
  }

  // Default variant - for post cards
  return (
    <motion.button
      onClick={handleToggleBookmark}
      whileHover={{ scale: loading ? 1 : 1.05 }}
      whileTap={{ scale: loading ? 1 : 0.95 }}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
        bookmarked
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
      )}
      {showLabel && (
        <span className="text-sm">{bookmarked ? 'Saved' : 'Save'}</span>
      )}
    </motion.button>
  )
}
