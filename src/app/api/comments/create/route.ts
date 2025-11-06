// src/app/api/comments/create/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get user from request (authentication check)
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to post a comment' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { postId, content, parentCommentId } = body

    // Validate required fields
    if (!postId || !content) {
      return NextResponse.json(
        { success: false, error: 'Post ID and content are required' },
        { status: 400 }
      )
    }

    // Validate content length
    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Comment is too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    // Convert postId to number if it's a string
    const numericPostId = typeof postId === 'string' ? parseInt(postId, 10) : postId

    // Check if post exists and has comments enabled
    const post = await payload.findByID({
      collection: 'posts',
      id: numericPostId,
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    if (!post.commentsSettings?.enableComments) {
      return NextResponse.json(
        { success: false, error: 'Comments are disabled for this post' },
        { status: 403 }
      )
    }

    // Create comment
    const commentData: any = {
      post: numericPostId,
      content: content.trim(),
      author: user.id, // Use authenticated user
    }

    if (parentCommentId) {
      const numericParentId = typeof parentCommentId === 'string' ? parseInt(parentCommentId, 10) : parentCommentId
      commentData.parentComment = numericParentId
    }

    const newComment = await payload.create({
      collection: 'comments',
      data: commentData,
      user, // Pass user context for access control
    })

    return NextResponse.json({
      success: true,
      comment: newComment,
      message: 'Comment submitted successfully. It will appear after moderation.',
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create comment: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}
