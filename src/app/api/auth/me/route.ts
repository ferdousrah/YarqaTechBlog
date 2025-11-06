// src/app/api/auth/me/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated', user: null },
        { status: 401 }
      )
    }

    // Verify token and get user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token', user: null },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get user', user: null },
      { status: 401 }
    )
  }
}
