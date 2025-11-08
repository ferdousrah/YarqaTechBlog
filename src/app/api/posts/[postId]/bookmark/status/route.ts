// src/app/api/posts/[postId]/bookmark/status/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token) {
      return NextResponse.json({
        success: true,
        bookmarked: false,
      })
    }

    // Get current user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({
        success: true,
        bookmarked: false,
      })
    }

    const { postId } = await params

    // Check if bookmark exists
    const existing = await payload.find({
      collection: 'bookmarks',
      where: {
        and: [
          { user: { equals: user.id } },
          { post: { equals: postId } }
        ],
      },
      limit: 1,
    })

    return NextResponse.json({
      success: true,
      bookmarked: existing.docs.length > 0,
    })
  } catch (error) {
    console.error('Check bookmark status error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check bookmark status',
      },
      { status: 500 }
    )
  }
}
