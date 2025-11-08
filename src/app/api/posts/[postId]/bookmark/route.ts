// src/app/api/posts/[postId]/bookmark/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
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

    if (existing.docs.length > 0) {
      // Remove bookmark
      await payload.delete({
        collection: 'bookmarks',
        id: existing.docs[0].id,
      })

      return NextResponse.json({
        success: true,
        bookmarked: false,
        message: 'Bookmark removed',
      })
    } else {
      // Add bookmark
      await payload.create({
        collection: 'bookmarks',
        data: {
          user: user.id,
          post: postId,
        },
      })

      return NextResponse.json({
        success: true,
        bookmarked: true,
        message: 'Post bookmarked',
      })
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to toggle bookmark: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    )
  }
}
