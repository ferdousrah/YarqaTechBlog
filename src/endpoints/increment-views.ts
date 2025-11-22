// src/endpoints/increment-views.ts - Payload 3.x
import type { Endpoint } from 'payload'

export const incrementViewsEndpoint: Endpoint = {
  path: '/posts/:postId/view',
  method: 'post',
  handler: async (req) => {
    const postId = req.routeParams?.postId

    console.log('Increment views endpoint called for postId:', postId)

    try {
      const post = await req.payload.findByID({
        collection: 'posts',
        id: postId as string,
      })

      if (!post) {
        console.error('Post not found:', postId)
        return Response.json({ success: false, error: 'Post not found' }, { status: 404 })
      }

      console.log('Current views:', post.views, 'New views:', (post.views || 0) + 1)

      // Increment views - use overrideAccess to bypass any access control
      const updatedPost = await req.payload.update({
        collection: 'posts',
        id: postId as string,
        data: {
          views: (post.views || 0) + 1,
        },
        overrideAccess: true,
      })

      console.log('Post updated successfully, new views:', updatedPost.views)

      // Log view
      try {
        await req.payload.create({
          collection: 'post-views' as any,
          data: {
            post: postId,
            user: req.user?.id,
            ipAddress: (req as any).ip || req.headers.get('x-forwarded-for'),
            userAgent: req.headers.get('user-agent'),
            referrer: req.headers.get('referer'),
          } as any,
          overrideAccess: true,
        })
        console.log('View logged successfully')
      } catch (logError) {
        console.error('Failed to log view (non-critical):', logError)
      }

      return Response.json({
        success: true,
        views: updatedPost.views,
      })
    } catch (error) {
      console.error('Error incrementing views:', error)
      return Response.json(
        { success: false, error: 'Failed to increment views', details: String(error) },
        { status: 500 },
      )
    }
  },
}
