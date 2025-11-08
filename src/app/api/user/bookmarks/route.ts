// src/app/api/user/bookmarks/route.ts
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
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get current user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch user's bookmarks with populated post data
    const bookmarks = await payload.find({
      collection: 'bookmarks',
      where: {
        user: { equals: user.id },
      },
      depth: 2, // Populate relationships
      sort: '-createdAt',
      limit: 100,
    })

    return NextResponse.json({
      success: true,
      bookmarks: bookmarks.docs,
    })
  } catch (error) {
    console.error('Fetch bookmarks error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bookmarks: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    )
  }
}
