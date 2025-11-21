// src/app/api/posts/[postId]/view/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { postId } = await params
    const payload = await getPayload({ config })

    // Get the current post
    const post = await payload.findByID({
      collection: 'posts',
      id: postId,
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Increment the view count
    const updatedPost = await payload.update({
      collection: 'posts',
      id: postId,
      data: {
        views: (post.views || 0) + 1,
      },
    })

    return NextResponse.json({
      success: true,
      views: updatedPost.views,
    })
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 },
    )
  }
}
