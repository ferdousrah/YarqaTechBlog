// src/endpoints/create-comment.ts - Payload 3.x
import type { Endpoint } from 'payload'

export const createCommentEndpoint: Endpoint = {
  path: '/comments/create',
  method: 'post',
  handler: async (req) => {
    try {
      const body = await req.json!() as any
      const { postId, content, guestName, guestEmail, parentCommentId } = body

      // Validate required fields
      if (!postId || !content) {
        return Response.json(
          { success: false, error: 'Post ID and content are required' },
          { status: 400 }
        )
      }

      // For guest users, require name and email
      if (!req.user && (!guestName || !guestEmail)) {
        return Response.json(
          { success: false, error: 'Name and email are required for guest comments' },
          { status: 400 }
        )
      }

      // Validate content length
      if (content.length > 1000) {
        return Response.json(
          { success: false, error: 'Comment is too long (max 1000 characters)' },
          { status: 400 }
        )
      }

      // Check if post exists and has comments enabled
      const post = await req.payload.findByID({
        collection: 'posts',
        id: postId,
      })

      if (!post) {
        return Response.json({ success: false, error: 'Post not found' }, { status: 404 })
      }

      if (!post.commentsSettings?.enableComments) {
        return Response.json(
          { success: false, error: 'Comments are disabled for this post' },
          { status: 403 }
        )
      }

      // Create comment
      const commentData: any = {
        post: postId,
        content: content.trim(),
      }

      if (req.user) {
        commentData.author = req.user.id
      } else {
        commentData.guestName = guestName.trim()
        commentData.guestEmail = guestEmail.trim()
      }

      if (parentCommentId) {
        commentData.parentComment = parentCommentId
      }

      const newComment = await req.payload.create({
        collection: 'comments',
        data: commentData,
      })

      return Response.json({
        success: true,
        comment: newComment,
        message: 'Comment submitted successfully. It will appear after moderation.',
      })
    } catch (error) {
      console.error('Error creating comment:', error)
      return Response.json({ success: false, error: 'Failed to create comment' }, { status: 500 })
    }
  },
}
