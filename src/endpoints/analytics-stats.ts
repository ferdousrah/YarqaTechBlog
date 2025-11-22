// src/endpoints/analytics-stats.ts - Payload 3.x
import type { Endpoint } from 'payload'

export const analyticsStatsEndpoint: Endpoint = {
  path: '/analytics-stats',
  method: 'get',
  handler: async (req) => {
    // Only allow authenticated users
    if (!req.user) {
      return Response.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    // Only admins and editors can view analytics
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    try {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      // Fetch all required data in parallel
      const [
        allSessions,
        todaySessions,
        last7DaysSessions,
        allPageViews,
        todayPageViews,
        activeSessions,
      ] = await Promise.all([
        // All sessions
        req.payload.find({
          collection: 'visitor-sessions' as any,
          limit: 10000,
          pagination: false,
        }),
        // Today's sessions
        req.payload.find({
          collection: 'visitor-sessions' as any,
          where: {
            createdAt: { greater_than_equal: today.toISOString() },
          },
          limit: 10000,
          pagination: false,
        }),
        // Last 7 days sessions
        req.payload.find({
          collection: 'visitor-sessions' as any,
          where: {
            createdAt: { greater_than_equal: last7Days.toISOString() },
          },
          limit: 10000,
          pagination: false,
        }),
        // All page views
        req.payload.find({
          collection: 'page-views' as any,
          limit: 10000,
          pagination: false,
        }),
        // Today's page views
        req.payload.find({
          collection: 'page-views' as any,
          where: {
            createdAt: { greater_than_equal: today.toISOString() },
          },
          limit: 10000,
          pagination: false,
        }),
        // Currently active sessions (active in last 5 minutes)
        req.payload.find({
          collection: 'visitor-sessions' as any,
          where: {
            isActive: { equals: true },
            updatedAt: {
              greater_than_equal: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
            },
          },
          limit: 100,
        }),
      ])

      // Calculate unique visitors
      const uniqueVisitors = new Set(allSessions.docs.map((s: any) => s.visitorId)).size
      const uniqueVisitorsToday = new Set(todaySessions.docs.map((s: any) => s.visitorId)).size
      const uniqueVisitors7Days = new Set(last7DaysSessions.docs.map((s: any) => s.visitorId)).size

      // Total page views
      const totalPageViews = allPageViews.totalDocs
      const pageViewsToday = todayPageViews.totalDocs

      // New vs returning visitors
      const newVisitors = allSessions.docs.filter((s: any) => s.isNewVisitor).length
      const returningVisitors = allSessions.docs.filter((s: any) => !s.isNewVisitor).length

      // Bounce rate
      const bouncedSessions = allSessions.docs.filter((s: any) => s.bounced).length
      const bounceRate = allSessions.docs.length > 0
        ? Math.round((bouncedSessions / allSessions.docs.length) * 100)
        : 0

      // Average session duration
      const sessionsWithDuration = allSessions.docs.filter((s: any) => s.duration > 0)
      const avgSessionDuration = sessionsWithDuration.length > 0
        ? Math.round(sessionsWithDuration.reduce((sum: number, s: any) => sum + s.duration, 0) / sessionsWithDuration.length)
        : 0

      // Average pages per session
      const avgPagesPerSession = allSessions.docs.length > 0
        ? Math.round((allSessions.docs.reduce((sum: number, s: any) => sum + (s.pageViews || 0), 0) / allSessions.docs.length) * 10) / 10
        : 0

      // Traffic by source
      const trafficBySource: Record<string, number> = {}
      allSessions.docs.forEach((s: any) => {
        const source = s.source || 'direct'
        trafficBySource[source] = (trafficBySource[source] || 0) + 1
      })
      const trafficSources = Object.entries(trafficBySource)
        .map(([source, count]) => ({ source, count, percentage: Math.round((count / allSessions.docs.length) * 100) }))
        .sort((a, b) => b.count - a.count)

      // Country stats
      const countryStats: Record<string, number> = {}
      allSessions.docs.forEach((s: any) => {
        const country = s.country || 'Unknown'
        countryStats[country] = (countryStats[country] || 0) + 1
      })
      const topCountries = Object.entries(countryStats)
        .map(([country, count]) => ({ country, count, percentage: Math.round((count / allSessions.docs.length) * 100) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Device breakdown
      const deviceStats: Record<string, number> = {}
      allSessions.docs.forEach((s: any) => {
        const device = s.device || 'desktop'
        deviceStats[device] = (deviceStats[device] || 0) + 1
      })
      const deviceBreakdown = Object.entries(deviceStats)
        .map(([device, count]) => ({ device, count, percentage: Math.round((count / allSessions.docs.length) * 100) }))
        .sort((a, b) => b.count - a.count)

      // Browser breakdown
      const browserStats: Record<string, number> = {}
      allSessions.docs.forEach((s: any) => {
        const browser = s.browser || 'Unknown'
        browserStats[browser] = (browserStats[browser] || 0) + 1
      })
      const browserBreakdown = Object.entries(browserStats)
        .map(([browser, count]) => ({ browser, count, percentage: Math.round((count / allSessions.docs.length) * 100) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Top pages by views
      const pageStats: Record<string, { count: number; title: string }> = {}
      allPageViews.docs.forEach((pv: any) => {
        const path = pv.path || '/'
        if (!pageStats[path]) {
          pageStats[path] = { count: 0, title: pv.title || path }
        }
        pageStats[path].count++
      })
      const topPages = Object.entries(pageStats)
        .map(([path, data]) => ({ path, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Visitors per day (last 7 days)
      const visitorsPerDay: { date: string; visitors: number; pageViews: number }[] = []
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

        const daySessions = last7DaysSessions.docs.filter((s: any) => {
          const createdAt = new Date(s.createdAt)
          return createdAt >= dayStart && createdAt < dayEnd
        })

        const dayViews = allPageViews.docs.filter((pv: any) => {
          const createdAt = new Date(pv.createdAt)
          return createdAt >= dayStart && createdAt < dayEnd
        })

        visitorsPerDay.push({
          date: dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          visitors: new Set(daySessions.map((s: any) => s.visitorId)).size,
          pageViews: dayViews.length,
        })
      }

      // Hourly traffic (today)
      const hourlyTraffic: { hour: string; visitors: number }[] = []
      for (let i = 0; i < 24; i++) {
        const hourStart = new Date(today.getTime() + i * 60 * 60 * 1000)
        const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)

        const hourSessions = todaySessions.docs.filter((s: any) => {
          const createdAt = new Date(s.createdAt)
          return createdAt >= hourStart && createdAt < hourEnd
        })

        hourlyTraffic.push({
          hour: `${i.toString().padStart(2, '0')}:00`,
          visitors: new Set(hourSessions.map((s: any) => s.visitorId)).size,
        })
      }

      // Average time on page
      const pagesWithTime = allPageViews.docs.filter((pv: any) => pv.timeOnPage > 0)
      const avgTimeOnPage = pagesWithTime.length > 0
        ? Math.round(pagesWithTime.reduce((sum: number, pv: any) => sum + pv.timeOnPage, 0) / pagesWithTime.length)
        : 0

      return Response.json({
        // Overview stats
        totalUniqueVisitors: uniqueVisitors,
        uniqueVisitorsToday,
        uniqueVisitors7Days,
        totalPageViews,
        pageViewsToday,
        currentOnline: activeSessions.totalDocs,

        // Visitor behavior
        newVisitors,
        returningVisitors,
        newVsReturningRatio: allSessions.docs.length > 0
          ? Math.round((newVisitors / allSessions.docs.length) * 100)
          : 0,
        bounceRate,
        avgSessionDuration, // in seconds
        avgPagesPerSession,
        avgTimeOnPage, // in seconds

        // Traffic sources (for pie chart)
        trafficSources,

        // Geographic data
        topCountries,

        // Technical data
        deviceBreakdown,
        browserBreakdown,

        // Content performance
        topPages,

        // Time series data (for charts)
        visitorsPerDay,
        hourlyTraffic,
      })
    } catch (error) {
      console.error('Analytics stats error:', error)
      return Response.json(
        { success: false, error: 'Failed to fetch analytics stats' },
        { status: 500 },
      )
    }
  },
}
