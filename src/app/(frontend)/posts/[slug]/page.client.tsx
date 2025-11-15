'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface PageClientProps {
  postId: string
}

const PageClient: React.FC<PageClientProps> = ({ postId }) => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  useEffect(() => {
    // Increment view count when post is viewed
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

export default PageClient
