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

    // Try to parse postId as number if it's a numeric string (for PostgreSQL auto-increment IDs)
    const parsedPostId = /^\d+$/.test(postId) ? parseInt(postId, 10) : postId

    console.log('[Bookmark API] Attempting to bookmark post with ID:', parsedPostId, 'type:', typeof parsedPostId)

    // Verify post exists
    try {
      const postExists = await payload.findByID({
        collection: 'posts',
        id: parsedPostId,
      })

      if (!postExists) {
        return NextResponse.json(
          { success: false, error: 'Post not found' },
          { status: 404 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid post ID or post not found' },
        { status: 404 }
      )
    }

    // Check if bookmark exists
    const existing = await payload.find({
      collection: 'bookmarks' as any,
      where: {
        and: [
          { user: { equals: user.id } },
          { post: { equals: parsedPostId } }
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Remove bookmark
      await payload.delete({
        collection: 'bookmarks' as any,
        id: existing.docs[0].id,
      })

      return NextResponse.json({
        success: true,
        bookmarked: false,
        message: 'Bookmark removed',
      })
    } else {
      // Add bookmark
      // Try to parse postId as number if it's a numeric string (for PostgreSQL auto-increment IDs)
      const parsedPostId = /^\d+$/.test(postId) ? parseInt(postId, 10) : postId

      console.log('[Bookmark API] Creating bookmark with postId:', parsedPostId, 'type:', typeof parsedPostId)

      await payload.create({
        collection: 'bookmarks' as any,
        data: {
          user: user.id,
          post: parsedPostId,
        } as any,
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
