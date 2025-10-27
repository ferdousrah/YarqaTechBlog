// src/endpoints/trending.ts - Payload 3.x
import type { Endpoint } from 'payload'

export const trendingEndpoint: Endpoint = {
  path: '/trending',
  method: 'get',
  handler: async (req) => {
    const { limit = 10 } = req.query

    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const posts = await req.payload.find({
        collection: 'posts',
        where: {
          status: { equals: 'published' },
          publishedAt: {
            greater_than: sevenDaysAgo.toISOString(),
          },
        },
        limit: Number(limit),
        sort: '-views',
      })

      return Response.json({
        success: true,
        posts: posts.docs,
      })
    } catch (error) {
      return Response.json(
        { success: false, error: 'Failed to fetch trending posts' },
        { status: 500 },
      )
    }
  },
}
