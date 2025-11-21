'use client'
import React, { useEffect } from 'react'

interface BlogPageClientProps {
  postId: string | number
}

const BlogPageClient: React.FC<BlogPageClientProps> = ({ postId }) => {
  useEffect(() => {
    // Increment view count when blog post is viewed
    const incrementView = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to increment view - Status:', response.status, errorData)
        } else {
          const data = await response.json()
          console.log('View incremented successfully:', data)
        }
      } catch (error) {
        console.error('Failed to increment view:', error)
      }
    }

    // Only increment view once per page load
    incrementView()
  }, [postId])

  return <React.Fragment />
}

export default BlogPageClient
