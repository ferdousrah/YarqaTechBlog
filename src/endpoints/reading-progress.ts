// src/endpoints/reading-progress.ts - Payload 3.x
import type { Endpoint } from 'payload'

export const readingProgressEndpoint: Endpoint = {
  path: '/posts/:postId/progress',
  method: 'post',
  handler: async (req) => {
    const postId = req.routeParams?.postId

    if (!req.user) {
      return Response.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    try {
      const body = await req.json!() as any
      const { progress } = body

      // Find existing progress
      const existing = await req.payload.find({
        collection: 'reading-progress' as any,
        where: {
          and: [{ user: { equals: req.user.id } }, { post: { equals: postId } }],
        },
      })

      if (existing.docs.length > 0) {
        // Update progress
        await req.payload.update({
          collection: 'reading-progress' as any,
          id: existing.docs[0].id,
          data: {
            progress: Number(progress),
          },
        })
      } else {
        // Create progress
        await req.payload.create({
          collection: 'reading-progress' as any,
          data: {
            user: req.user.id,
            post: postId,
            progress: Number(progress),
          } as any,
        })
      }

      return Response.json({
        success: true,
        progress: Number(progress),
      })
    } catch (error) {
      return Response.json({ success: false, error: 'Failed to update progress' }, { status: 500 })
    }
  },
}
