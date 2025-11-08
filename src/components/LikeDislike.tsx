'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/Auth/AuthModal'

interface LikeDislikeProps {
  postId: string
  initialLikes?: number
  initialDislikes?: number
}

export default function LikeDislike({
  postId,
  initialLikes = 0,
  initialDislikes = 0,
}: LikeDislikeProps) {
  const { user } = useAuth()
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null)
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [loading, setLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Fetch user's existing reaction
  useEffect(() => {
    const fetchReaction = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/posts/${postId}/reaction`)
          const data = await response.json()
          if (data.success && data.reaction) {
            setUserReaction(data.reaction.type)
          }
        } catch (error) {
          console.error('Error fetching reaction:', error)
        }
      } else {
        setUserReaction(null)
      }
    }
    fetchReaction()
  }, [user, postId])

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/posts/${postId}/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reactionType: type }),
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setUserReaction(data.reaction?.type || null)
        setLikes(data.stats.likes)
        setDislikes(data.stats.dislikes)
      } else {
        console.error('Failed to update reaction:', data.error)
      }
    } catch (error) {
      console.error('Error updating reaction:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleReaction('like')}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            userReaction === 'like'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ThumbsUp className={`w-5 h-5 ${userReaction === 'like' ? 'fill-current' : ''}`} />
          <span className="font-semibold">{likes}</span>
        </button>

        <button
          onClick={() => handleReaction('dislike')}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            userReaction === 'dislike'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ThumbsDown className={`w-5 h-5 ${userReaction === 'dislike' ? 'fill-current' : ''}`} />
          <span className="font-semibold">{dislikes}</span>
        </button>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />
    </>
  )
}
