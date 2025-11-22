// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    // Try to get current user and update logout tracking
    if (token) {
      try {
        const { user } = await payload.auth({ headers: request.headers })

        if (user) {
          // Calculate session duration
          let sessionDuration = 0
          const userAny = user as any
          if (userAny.lastLoginAt) {
            const loginTime = new Date(userAny.lastLoginAt).getTime()
            const logoutTime = Date.now()
            sessionDuration = Math.round((logoutTime - loginTime) / 1000) // Duration in seconds
          }

          // Update user logout tracking
          await payload.update({
            collection: 'users',
            id: user.id,
            data: {
              lastLogoutAt: new Date().toISOString(),
              totalLoginTime: (userAny.totalLoginTime || 0) + sessionDuration,
            } as any,
          })
        }
      } catch (trackingError) {
        console.error('Failed to update logout tracking:', trackingError)
        // Don't fail logout if tracking fails
      }
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    })

    // Clear auth cookie
    response.cookies.delete('payload-token')

    // Also try to clear with path specified
    response.cookies.set('payload-token', '', {
      expires: new Date(0),
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}
