// src/endpoints/search.ts - Payload 3.x
import type { Endpoint } from 'payload'

export const searchEndpoint: Endpoint = {
  path: '/search',
  method: 'get',
  handler: async (req) => {
    const { query, category, tag, page = 1, limit = 10 } = req.query

    try {
      const where: any = {
        status: { equals: 'published' },
      }

      // Full-text search
      if (query) {
        where.or = [
          {
            title: {
              contains: query,
            },
          },
          {
            excerpt: {
              contains: query,
            },
          },
        ]

        // Log search query
        await req.payload.create({
          collection: 'search-queries' as any,
          data: {
            query: query as string,
            user: req.user?.id,
            ipAddress: (req as any).ip || req.headers.get('x-forwarded-for'),
            userAgent: req.headers.get('user-agent'),
          } as any,
        })
      }

      // Filter by category
      if (category) {
        where.category = { equals: category }
      }

      // Filter by tag
      if (tag) {
        where.tags = { in: [tag] }
      }

      const results = await req.payload.find({
        collection: 'posts',
        where,
        page: Number(page),
        limit: Number(limit),
        sort: '-publishedAt',
      })

      return Response.json({
        success: true,
        docs: results.docs,
        totalDocs: results.totalDocs,
        totalPages: results.totalPages,
        page: results.page,
      })
    } catch (error) {
      return Response.json({ success: false, error: 'Search failed' }, { status: 500 })
    }
  },
}
