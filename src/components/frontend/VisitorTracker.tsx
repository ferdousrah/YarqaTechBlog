'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function VisitorTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sessionStarted = useRef(false)
  const sessionId = useRef<string | null>(null)
  const visitorId = useRef<string | null>(null)
  const pageStartTime = useRef<number>(Date.now())
  const maxScrollDepth = useRef<number>(0)
  const lastPath = useRef<string>(pathname)

  // Initialize session on mount
  useEffect(() => {
    const initializeSession = async () => {
      if (sessionStarted.current) return

      try {
        // Check if session exists
        const statusRes = await fetch('/api/analytics/track')
        const status = await statusRes.json()

        if (status.hasSession) {
          sessionId.current = status.sessionId
          visitorId.current = status.visitorId
          sessionStarted.current = true
        } else {
          // Start new session
          const utmSource = searchParams.get('utm_source')
          const utmMedium = searchParams.get('utm_medium')
          const utmCampaign = searchParams.get('utm_campaign')

          const res = await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'session_start',
              data: {
                path: pathname,
                utmSource,
                utmMedium,
                utmCampaign,
                referrer: document.referrer,
              },
            }),
          })

          const data = await res.json()
          if (data.success) {
            sessionId.current = data.sessionId
            visitorId.current = data.visitorId
            sessionStarted.current = true
          }
        }
      } catch (error) {
        console.error('Failed to initialize session:', error)
      }
    }

    initializeSession()
  }, [])

  // Track page views
  useEffect(() => {
    if (!sessionStarted.current) return

    const trackPageView = async () => {
      try {
        // Extract post ID from pathname if it's a post page
        let postId = null
        let categoryId = null

        // Get page title
        const title = document.title

        // Get internal referrer (previous page)
        const internalReferrer = lastPath.current

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'page_view',
            data: {
              path: pathname,
              title,
              postId,
              categoryId,
              internalReferrer,
            },
          }),
        })

        // Reset page tracking
        pageStartTime.current = Date.now()
        maxScrollDepth.current = 0
        lastPath.current = pathname
      } catch (error) {
        console.error('Failed to track page view:', error)
      }
    }

    trackPageView()
  }, [pathname])

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop

      const scrollPercentage = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      )

      if (scrollPercentage > maxScrollDepth.current) {
        maxScrollDepth.current = Math.min(scrollPercentage, 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track page exit (when navigating away)
  useEffect(() => {
    const handlePageExit = async () => {
      if (!sessionStarted.current) return

      const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000)

      try {
        // Use sendBeacon for reliable tracking when page is unloading
        const data = JSON.stringify({
          action: 'page_exit',
          data: {
            path: pathname,
            timeOnPage,
            scrollDepth: maxScrollDepth.current,
          },
        })

        navigator.sendBeacon('/api/analytics/track', data)
      } catch (error) {
        // Fallback to regular fetch
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'page_exit',
            data: {
              path: pathname,
              timeOnPage,
              scrollDepth: maxScrollDepth.current,
            },
          }),
        })
      }
    }

    // Track exit on beforeunload
    window.addEventListener('beforeunload', handlePageExit)

    // Track exit on visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handlePageExit()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handlePageExit)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pathname])

  // End session on page unload (when user closes browser/tab)
  useEffect(() => {
    const handleSessionEnd = () => {
      if (!sessionStarted.current) return

      try {
        const data = JSON.stringify({
          action: 'session_end',
          data: {},
        })

        navigator.sendBeacon('/api/analytics/track', data)
      } catch (error) {
        console.error('Failed to end session:', error)
      }
    }

    window.addEventListener('beforeunload', handleSessionEnd)
    return () => window.removeEventListener('beforeunload', handleSessionEnd)
  }, [])

  return null
}
