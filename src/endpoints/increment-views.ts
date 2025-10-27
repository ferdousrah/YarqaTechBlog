// src/endpoints/increment-views.ts - Payload 3.x
import type { Endpoint } from 'payload'

export const incrementViewsEndpoint: Endpoint = {
  path: '/posts/:postId/view',
  method: 'post',
  handler: async (req) => {
    const postId = req.routeParams?.postId

    try {
      const post = await req.payload.findByID({
        collection: 'posts',
        id: postId as string,
      })

      if (!post) {
        return Response.json({ success: false, error: 'Post not found' }, { status: 404 })
      }

      // Increment views
      await req.payload.update({
        collection: 'posts',
        id: postId as string,
        data: {
          views: (post.views || 0) + 1,
        },
      })

      // Log view
      await req.payload.create({
        collection: 'post-views',
        data: {
          post: postId as string,
          user: req.user?.id,
          ipAddress: req.ip,
          userAgent: req.headers.get('user-agent'),
          referrer: req.headers.get('referer'),
        },
      })

      return Response.json({
        success: true,
        views: (post.views || 0) + 1,
      })
    } catch (error) {
      return Response.json({ success: false, error: 'Failed to increment views' }, { status: 500 })
    }
  },
}
