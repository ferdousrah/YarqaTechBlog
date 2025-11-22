// src/app/api/posts/[postId]/reaction/route.ts - Handle post reactions (like/dislike)
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

// GET - Get user's reaction to a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { postId } = await params
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    // Verify user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    // Convert postId to number if needed (for relationship fields)
    const numericPostId = typeof postId === 'string' ? parseInt(postId, 10) : postId

    // Find user's reaction to this post
    const reactions = await payload.find({
      collection: 'post-reactions' as any,
      where: {
        and: [{ user: { equals: user.id } }, { post: { equals: numericPostId } }],
      },
      limit: 1,
    })

    const reaction = reactions.docs[0]

    return NextResponse.json({
      success: true,
      reaction: reaction
        ? {
            type: reaction.reactionType,
            id: reaction.id,
          }
        : null,
    })
  } catch (error) {
    console.error('Error fetching reaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reaction' },
      { status: 500 },
    )
  }
}

// POST - Add or update reaction
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { postId } = await params
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    // Verify user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { reactionType } = body

    if (!reactionType || !['like', 'dislike'].includes(reactionType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reaction type' },
        { status: 400 },
      )
    }

    // Convert postId to number if needed (for relationship fields)
    const numericPostId = typeof postId === 'string' ? parseInt(postId, 10) : postId

    // Check if user already has a reaction
    const existing = await payload.find({
      collection: 'post-reactions' as any,
      where: {
        and: [{ user: { equals: user.id } }, { post: { equals: numericPostId } }],
      },
      limit: 1,
    })

    const existingReaction = existing.docs[0]

    // Get current post stats
    const post = await payload.findByID({
      collection: 'posts',
      id: numericPostId,
    })

    let newLikes = (post as any).likes || 0
    let newDislikes = (post as any).dislikes || 0

    if (existingReaction) {
      // User is changing their reaction
      if (existingReaction.reactionType === reactionType) {
        // Same reaction - remove it
        await payload.delete({
          collection: 'post-reactions' as any,
          id: existingReaction.id,
        })

        // Update post stats
        if (reactionType === 'like') {
          newLikes = Math.max(0, newLikes - 1)
        } else {
          newDislikes = Math.max(0, newDislikes - 1)
        }

        await payload.update({
          collection: 'posts',
          id: numericPostId,
          data: {
            likes: newLikes,
            dislikes: newDislikes,
          } as any,
        })

        return NextResponse.json({
          success: true,
          message: 'Reaction removed',
          reaction: null,
          stats: { likes: newLikes, dislikes: newDislikes },
        })
      } else {
        // Different reaction - update it
        await payload.update({
          collection: 'post-reactions' as any,
          id: existingReaction.id,
          data: {
            reactionType,
          },
        })

        // Update post stats (swap counts)
        if (reactionType === 'like') {
          newLikes = newLikes + 1
          newDislikes = Math.max(0, newDislikes - 1)
        } else {
          newDislikes = newDislikes + 1
          newLikes = Math.max(0, newLikes - 1)
        }

        await payload.update({
          collection: 'posts',
          id: numericPostId,
          data: {
            likes: newLikes,
            dislikes: newDislikes,
          } as any,
        })

        return NextResponse.json({
          success: true,
          message: 'Reaction updated',
          reaction: { type: reactionType, id: existingReaction.id },
          stats: { likes: newLikes, dislikes: newDislikes },
        })
      }
    } else {
      // New reaction
      const newReaction = await payload.create({
        collection: 'post-reactions' as any,
        data: {
          user: user.id,
          post: numericPostId,
          reactionType,
        },
      })

      // Update post stats
      if (reactionType === 'like') {
        newLikes = newLikes + 1
      } else {
        newDislikes = newDislikes + 1
      }

      await payload.update({
        collection: 'posts',
        id: numericPostId,
        data: {
          likes: newLikes,
          dislikes: newDislikes,
        } as any,
      })

      return NextResponse.json({
        success: true,
        message: 'Reaction added',
        reaction: { type: reactionType, id: newReaction.id },
        stats: { likes: newLikes, dislikes: newDislikes },
      })
    }
  } catch (error) {
    console.error('Error updating reaction:', error)
    return NextResponse.json({ success: false, error: 'Failed to update reaction' }, { status: 500 })
  }
}
