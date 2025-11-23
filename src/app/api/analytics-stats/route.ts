// src/app/api/analytics-stats/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Verify user from headers (includes cookies)
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) {
      return Response.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    // Only admins and editors can view analytics
    const userRole = (user as any).role
    if (userRole !== 'admin' && userRole !== 'editor') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    // Get date range from query params
    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get('range') || '7d' // Default to 7 days
    const fromDate = searchParams.get('from') // Custom start date (YYYY-MM-DD)
    const toDate = searchParams.get('to') // Custom end date (YYYY-MM-DD)

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Calculate date range based on parameter
    let rangeStart: Date
    let rangeEnd: Date = new Date(today.getTime() + 24 * 60 * 60 * 1000) // End of today
    let daysToShow: number

    // Check for custom date range first
    if (fromDate && toDate) {
      rangeStart = new Date(fromDate)
      rangeEnd = new Date(toDate)
      rangeEnd.setDate(rangeEnd.getDate() + 1) // Include the end date
      daysToShow = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (24 * 60 * 60 * 1000))
    } else {
      switch (range) {
        case '30d':
          rangeStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          daysToShow = 30
          break
        case '6m':
          rangeStart = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000)
          daysToShow = 180
          break
        case '1y':
          rangeStart = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)
          daysToShow = 365
          break
        case '7d':
        default:
          rangeStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          daysToShow = 7
          break
      }
    }

    // Fetch all required data in parallel
    const [
      allSessions,
      todaySessions,
      rangeSessions,
      allPageViews,
      todayPageViews,
      rangePageViews,
      activeSessions,
    ] = await Promise.all([
      // All sessions
      payload.find({
        collection: 'visitor-sessions' as any,
        limit: 10000,
        pagination: false,
      }),
      // Today's sessions
      payload.find({
        collection: 'visitor-sessions' as any,
        where: {
          createdAt: { greater_than_equal: today.toISOString() },
        },
        limit: 10000,
        pagination: false,
      }),
      // Sessions in selected range
      payload.find({
        collection: 'visitor-sessions' as any,
        where: {
          createdAt: { greater_than_equal: rangeStart.toISOString() },
        },
        limit: 10000,
        pagination: false,
      }),
      // All page views
      payload.find({
        collection: 'page-views' as any,
        limit: 10000,
        pagination: false,
      }),
      // Today's page views
      payload.find({
        collection: 'page-views' as any,
        where: {
          createdAt: { greater_than_equal: today.toISOString() },
        },
        limit: 10000,
        pagination: false,
      }),
      // Page views in selected range
      payload.find({
        collection: 'page-views' as any,
        where: {
          createdAt: { greater_than_equal: rangeStart.toISOString() },
        },
        limit: 10000,
        pagination: false,
      }),
      // Currently active sessions (active in last 5 minutes)
      payload.find({
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
    const uniqueVisitorsInRange = new Set(rangeSessions.docs.map((s: any) => s.visitorId)).size

    // Total page views
    const totalPageViews = allPageViews.totalDocs
    const pageViewsToday = todayPageViews.totalDocs
    const pageViewsInRange = rangePageViews.totalDocs

    // New vs returning visitors (in range)
    const newVisitors = rangeSessions.docs.filter((s: any) => s.isNewVisitor).length
    const returningVisitors = rangeSessions.docs.filter((s: any) => !s.isNewVisitor).length

    // Bounce rate (in range)
    const bouncedSessions = rangeSessions.docs.filter((s: any) => s.bounced).length
    const bounceRate = rangeSessions.docs.length > 0
      ? Math.round((bouncedSessions / rangeSessions.docs.length) * 100)
      : 0

    // Average session duration (in range)
    const sessionsWithDuration = rangeSessions.docs.filter((s: any) => s.duration > 0)
    const avgSessionDuration = sessionsWithDuration.length > 0
      ? Math.round(sessionsWithDuration.reduce((sum: number, s: any) => sum + s.duration, 0) / sessionsWithDuration.length)
      : 0

    // Average pages per session (in range)
    const avgPagesPerSession = rangeSessions.docs.length > 0
      ? Math.round((rangeSessions.docs.reduce((sum: number, s: any) => sum + (s.pageViews || 0), 0) / rangeSessions.docs.length) * 10) / 10
      : 0

    // Traffic by source (in range)
    const trafficBySource: Record<string, number> = {}
    rangeSessions.docs.forEach((s: any) => {
      const source = s.source || 'direct'
      trafficBySource[source] = (trafficBySource[source] || 0) + 1
    })
    const trafficSources = Object.entries(trafficBySource)
      .map(([source, count]) => ({ source, count, percentage: Math.round((count / rangeSessions.docs.length) * 100) || 0 }))
      .sort((a, b) => b.count - a.count)

    // Country stats (in range)
    const countryStats: Record<string, number> = {}
    rangeSessions.docs.forEach((s: any) => {
      const country = s.country || 'Unknown'
      countryStats[country] = (countryStats[country] || 0) + 1
    })
    const topCountries = Object.entries(countryStats)
      .map(([country, count]) => ({ country, count, percentage: Math.round((count / rangeSessions.docs.length) * 100) || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Device breakdown (in range)
    const deviceStats: Record<string, number> = {}
    rangeSessions.docs.forEach((s: any) => {
      const device = s.device || 'desktop'
      deviceStats[device] = (deviceStats[device] || 0) + 1
    })
    const deviceBreakdown = Object.entries(deviceStats)
      .map(([device, count]) => ({ device, count, percentage: Math.round((count / rangeSessions.docs.length) * 100) || 0 }))
      .sort((a, b) => b.count - a.count)

    // Browser breakdown (in range)
    const browserStats: Record<string, number> = {}
    rangeSessions.docs.forEach((s: any) => {
      const browser = s.browser || 'Unknown'
      browserStats[browser] = (browserStats[browser] || 0) + 1
    })
    const browserBreakdown = Object.entries(browserStats)
      .map(([browser, count]) => ({ browser, count, percentage: Math.round((count / rangeSessions.docs.length) * 100) || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Top pages by views (in range)
    const pageStats: Record<string, { count: number; title: string }> = {}
    rangePageViews.docs.forEach((pv: any) => {
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

    // Visitors per day (based on selected range)
    // For longer ranges, group by week or month
    const visitorsPerDay: { date: string; visitors: number; pageViews: number }[] = []

    if (daysToShow <= 30) {
      // Show daily data
      for (let i = daysToShow - 1; i >= 0; i--) {
        const dayStart = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

        const daySessions = rangeSessions.docs.filter((s: any) => {
          const createdAt = new Date(s.createdAt)
          return createdAt >= dayStart && createdAt < dayEnd
        })

        const dayViews = rangePageViews.docs.filter((pv: any) => {
          const createdAt = new Date(pv.createdAt)
          return createdAt >= dayStart && createdAt < dayEnd
        })

        visitorsPerDay.push({
          date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          visitors: new Set(daySessions.map((s: any) => s.visitorId)).size,
          pageViews: dayViews.length,
        })
      }
    } else if (daysToShow <= 180) {
      // Show weekly data for 6 months
      const weeks = Math.ceil(daysToShow / 7)
      for (let i = weeks - 1; i >= 0; i--) {
        const weekStart = new Date(today.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000)
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

        const weekSessions = rangeSessions.docs.filter((s: any) => {
          const createdAt = new Date(s.createdAt)
          return createdAt >= weekStart && createdAt < weekEnd
        })

        const weekViews = rangePageViews.docs.filter((pv: any) => {
          const createdAt = new Date(pv.createdAt)
          return createdAt >= weekStart && createdAt < weekEnd
        })

        visitorsPerDay.push({
          date: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          visitors: new Set(weekSessions.map((s: any) => s.visitorId)).size,
          pageViews: weekViews.length,
        })
      }
    } else {
      // Show monthly data for 1 year
      for (let i = 11; i >= 0; i--) {
        const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1)
        const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 1)

        const monthSessions = rangeSessions.docs.filter((s: any) => {
          const createdAt = new Date(s.createdAt)
          return createdAt >= monthStart && createdAt < monthEnd
        })

        const monthViews = rangePageViews.docs.filter((pv: any) => {
          const createdAt = new Date(pv.createdAt)
          return createdAt >= monthStart && createdAt < monthEnd
        })

        visitorsPerDay.push({
          date: monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          visitors: new Set(monthSessions.map((s: any) => s.visitorId)).size,
          pageViews: monthViews.length,
        })
      }
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

    // Average time on page (in range)
    const pagesWithTime = rangePageViews.docs.filter((pv: any) => pv.timeOnPage > 0)
    const avgTimeOnPage = pagesWithTime.length > 0
      ? Math.round(pagesWithTime.reduce((sum: number, pv: any) => sum + pv.timeOnPage, 0) / pagesWithTime.length)
      : 0

    // Calculate trend (compare current period to previous period)
    const previousRangeStart = new Date(rangeStart.getTime() - daysToShow * 24 * 60 * 60 * 1000)
    const previousSessions = allSessions.docs.filter((s: any) => {
      const createdAt = new Date(s.createdAt)
      return createdAt >= previousRangeStart && createdAt < rangeStart
    })
    const previousVisitors = new Set(previousSessions.map((s: any) => s.visitorId)).size
    const visitorsTrend = previousVisitors > 0
      ? Math.round(((uniqueVisitorsInRange - previousVisitors) / previousVisitors) * 100)
      : uniqueVisitorsInRange > 0 ? 100 : 0

    return Response.json({
      // Overview stats
      totalUniqueVisitors: uniqueVisitors,
      uniqueVisitorsToday,
      uniqueVisitorsInRange,
      totalPageViews,
      pageViewsToday,
      pageViewsInRange,
      currentOnline: activeSessions.totalDocs,

      // Trend
      visitorsTrend,

      // Visitor behavior
      newVisitors,
      returningVisitors,
      newVsReturningRatio: rangeSessions.docs.length > 0
        ? Math.round((newVisitors / rangeSessions.docs.length) * 100)
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

      // Meta
      dateRange: fromDate && toDate ? 'custom' : range,
      rangeLabel: fromDate && toDate
        ? `${new Date(fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(toDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        : range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range === '6m' ? 'Last 6 Months' : 'Last Year',
      fromDate: fromDate || null,
      toDate: toDate || null,
    })
  } catch (error) {
    console.error('Analytics stats error:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch analytics stats' },
      { status: 500 },
    )
  }
}
