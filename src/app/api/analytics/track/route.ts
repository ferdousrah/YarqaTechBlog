// src/app/api/analytics/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

// Helper to detect device type from user agent
function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
  const ua = userAgent.toLowerCase()
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'mobile'
  }
  return 'desktop'
}

// Helper to detect browser from user agent
function getBrowser(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('SamsungBrowser')) return 'Samsung Browser'
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera'
  if (userAgent.includes('Trident')) return 'Internet Explorer'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Edg')) return 'Edge'
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Safari')) return 'Safari'
  return 'Unknown'
}

// Helper to detect OS from user agent
function getOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac OS')) return 'macOS'
  if (userAgent.includes('Linux')) return 'Linux'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS'
  return 'Unknown'
}

// Helper to classify traffic source
function classifySource(referrer: string | null, utmSource: string | null): string {
  if (utmSource) {
    const source = utmSource.toLowerCase()
    if (source.includes('google') || source.includes('bing') || source.includes('yahoo')) return 'organic'
    if (source.includes('facebook') || source.includes('twitter') || source.includes('linkedin') || source.includes('instagram')) return 'social'
    if (source.includes('email') || source.includes('newsletter')) return 'email'
    if (source.includes('cpc') || source.includes('ppc') || source.includes('paid')) return 'paid'
    return 'referral'
  }

  if (!referrer) return 'direct'

  const ref = referrer.toLowerCase()
  if (ref.includes('google.') || ref.includes('bing.') || ref.includes('yahoo.') || ref.includes('duckduckgo.')) return 'organic'
  if (ref.includes('facebook.') || ref.includes('twitter.') || ref.includes('linkedin.') || ref.includes('instagram.') || ref.includes('t.co')) return 'social'

  return 'referral'
}

// Generate a unique visitor ID
function generateVisitorId(): string {
  return `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Generate a unique session ID
function generateSessionId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { action, data } = body

    const cookieStore = await cookies()
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || data?.referrer || null

    // Get or create visitor ID from cookie
    let visitorId = cookieStore.get('visitor_id')?.value
    let isNewVisitor = false

    if (!visitorId) {
      visitorId = generateVisitorId()
      isNewVisitor = true
    }

    // Get IP address (for geolocation)
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'

    if (action === 'session_start') {
      // Create new session
      const sessionId = generateSessionId()

      // Get country from IP (simplified - in production use a geolocation service)
      let country = 'Unknown'
      let city = ''
      let region = ''

      // Try to get geolocation from headers (some CDNs provide this)
      const cfCountry = request.headers.get('cf-ipcountry')
      if (cfCountry) {
        country = cfCountry
      }

      const session = await payload.create({
        collection: 'visitor-sessions',
        data: {
          visitorId,
          sessionId,
          isNewVisitor,
          startTime: new Date().toISOString(),
          pageViews: 0,
          bounced: true, // Assume bounced until they view another page
          source: classifySource(referrer, data?.utmSource),
          referrer: referrer,
          utmSource: data?.utmSource || null,
          utmMedium: data?.utmMedium || null,
          utmCampaign: data?.utmCampaign || null,
          country,
          city,
          region,
          device: getDeviceType(userAgent),
          browser: getBrowser(userAgent),
          os: getOS(userAgent),
          userAgent,
          ip,
          entryPage: data?.path || '/',
          isActive: true,
        },
      })

      // Create response with cookies
      const response = NextResponse.json({
        success: true,
        visitorId,
        sessionId,
        isNewVisitor,
      })

      // Set visitor ID cookie (expires in 1 year)
      response.cookies.set('visitor_id', visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60, // 1 year
        path: '/',
      })

      // Set session ID cookie (expires in 30 minutes)
      response.cookies.set('session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 60, // 30 minutes
        path: '/',
      })

      return response
    }

    if (action === 'page_view') {
      const sessionId = cookieStore.get('session_id')?.value

      if (!sessionId) {
        return NextResponse.json({ success: false, error: 'No active session' }, { status: 400 })
      }

      // Find the active session
      const sessions = await payload.find({
        collection: 'visitor-sessions',
        where: {
          sessionId: { equals: sessionId },
          isActive: { equals: true },
        },
        limit: 1,
      })

      if (sessions.docs.length === 0) {
        return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 })
      }

      const session = sessions.docs[0]

      // Create page view record
      await payload.create({
        collection: 'page-views',
        data: {
          visitorId,
          sessionId,
          session: session.id,
          path: data.path,
          title: data.title,
          post: data.postId || null,
          category: data.categoryId || null,
          referrer: data.internalReferrer || null,
          timestamp: new Date().toISOString(),
        },
      })

      // Update session with new page view count and mark as not bounced
      const newPageViews = (session.pageViews || 0) + 1
      await payload.update({
        collection: 'visitor-sessions',
        id: session.id,
        data: {
          pageViews: newPageViews,
          bounced: newPageViews <= 1, // Only bounced if only 1 page view
          exitPage: data.path,
        },
      })

      // Refresh session cookie
      const response = NextResponse.json({ success: true })
      response.cookies.set('session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 60, // 30 minutes
        path: '/',
      })

      return response
    }

    if (action === 'page_exit') {
      const sessionId = cookieStore.get('session_id')?.value

      if (!sessionId) {
        return NextResponse.json({ success: false })
      }

      // Update the last page view with time spent and scroll depth
      const pageViews = await payload.find({
        collection: 'page-views',
        where: {
          sessionId: { equals: sessionId },
          path: { equals: data.path },
        },
        sort: '-createdAt',
        limit: 1,
      })

      if (pageViews.docs.length > 0) {
        await payload.update({
          collection: 'page-views',
          id: pageViews.docs[0].id,
          data: {
            timeOnPage: data.timeOnPage || 0,
            scrollDepth: data.scrollDepth || 0,
          },
        })
      }

      return NextResponse.json({ success: true })
    }

    if (action === 'session_end') {
      const sessionId = cookieStore.get('session_id')?.value

      if (!sessionId) {
        return NextResponse.json({ success: false })
      }

      // Find and update the session
      const sessions = await payload.find({
        collection: 'visitor-sessions',
        where: {
          sessionId: { equals: sessionId },
        },
        limit: 1,
      })

      if (sessions.docs.length > 0) {
        const session = sessions.docs[0]
        const startTime = new Date(session.startTime).getTime()
        const endTime = Date.now()
        const duration = Math.round((endTime - startTime) / 1000) // Duration in seconds

        await payload.update({
          collection: 'visitor-sessions',
          id: session.id,
          data: {
            endTime: new Date().toISOString(),
            duration,
            isActive: false,
          },
        })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ success: false, error: 'Tracking failed' }, { status: 500 })
  }
}

// GET endpoint to check current session status
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const visitorId = cookieStore.get('visitor_id')?.value
    const sessionId = cookieStore.get('session_id')?.value

    return NextResponse.json({
      hasVisitor: !!visitorId,
      hasSession: !!sessionId,
      visitorId,
      sessionId,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get session status' }, { status: 500 })
  }
}
