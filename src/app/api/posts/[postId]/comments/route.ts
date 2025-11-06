// src/app/api/posts/[postId]/comments/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const payload = await getPayload({ config })
    const postId = params.postId

    // Convert postId to number if needed
    const numericPostId = typeof postId === 'string' ? parseInt(postId, 10) : postId

    const comments = await payload.find({
      collection: 'comments',
      where: {
        post: { equals: numericPostId },
        status: { equals: 'approved' },
        parentComment: { exists: false }, // Only top-level comments
      },
      depth: 2, // Include author and nested replies
      sort: '-createdAt',
      limit: 100,
    })

    // Fetch replies for each top-level comment
    const commentsWithReplies = await Promise.all(
      comments.docs.map(async (comment) => {
        const replies = await payload.find({
          collection: 'comments',
          where: {
            parentComment: { equals: comment.id },
            status: { equals: 'approved' },
          },
          depth: 2,
          sort: 'createdAt',
          limit: 50,
        })

        return {
          ...comment,
          replies: replies.docs,
        }
      })
    )

    return NextResponse.json({
      success: true,
      comments: commentsWithReplies,
      total: comments.totalDocs,
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
