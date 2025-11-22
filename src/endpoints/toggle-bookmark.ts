// src/endpoints/toggle-bookmark.ts - Payload 3.x
import type { Endpoint } from 'payload'

export const toggleBookmarkEndpoint: Endpoint = {
  path: '/posts/:postId/bookmark',
  method: 'post',
  handler: async (req) => {
    const postId = req.routeParams?.postId

    if (!req.user) {
      return Response.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    try {
      // Check if bookmark exists
      const existing = await req.payload.find({
        collection: 'bookmarks' as any,
        where: {
          and: [{ user: { equals: req.user.id } }, { post: { equals: postId } }],
        },
      })

      if (existing.docs.length > 0) {
        // Remove bookmark
        await req.payload.delete({
          collection: 'bookmarks' as any,
          id: existing.docs[0].id,
        })

        return Response.json({
          success: true,
          bookmarked: false,
        })
      } else {
        // Add bookmark
        await req.payload.create({
          collection: 'bookmarks' as any,
          data: {
            user: req.user.id,
            post: postId,
          } as any,
        })

        return Response.json({
          success: true,
          bookmarked: true,
        })
      }
    } catch (error) {
      return Response.json({ success: false, error: 'Failed to toggle bookmark' }, { status: 500 })
    }
  },
}
