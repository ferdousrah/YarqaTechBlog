// src/endpoints/get-comments.ts - Payload 3.x
import type { Endpoint } from 'payload'

export const getCommentsEndpoint: Endpoint = {
  path: '/posts/:postId/comments',
  method: 'get',
  handler: async (req) => {
    const postId = req.routeParams?.postId

    try {
      const comments = await req.payload.find({
        collection: 'comments',
        where: {
          post: { equals: postId },
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
          const replies = await req.payload.find({
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

      return Response.json({
        success: true,
        comments: commentsWithReplies,
        total: comments.totalDocs,
      })
    } catch (error) {
      console.error('Error fetching comments:', error)
      return Response.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 })
    }
  },
}
