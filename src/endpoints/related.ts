// src/endpoints/related.ts - Payload 3.x
import type { Endpoint } from 'payload'

export const relatedEndpoint: Endpoint = {
  path: '/related/:postId',
  method: 'get',
  handler: async (req) => {
    const postId = req.routeParams?.postId
    const { limit = 5 } = req.query

    try {
      const post = await req.payload.findByID({
        collection: 'posts',
        id: postId as string,
      })

      if (!post) {
        return Response.json({ success: false, error: 'Post not found' }, { status: 404 })
      }

      // If manual related posts are set
      if (post.relatedPosts && Array.isArray(post.relatedPosts) && post.relatedPosts.length > 0) {
        return Response.json({
          success: true,
          posts: post.relatedPosts,
        })
      }

      // Auto-find related posts
      const categoryId = typeof post.category === 'object' ? post.category.id : post.category
      const tagIds = Array.isArray(post.tags)
        ? post.tags.map((tag) => (typeof tag === 'object' ? tag.id : tag))
        : []

      const related = await req.payload.find({
        collection: 'posts',
        where: {
          and: [
            { status: { equals: 'published' } },
            { id: { not_equals: postId } },
            {
              or: [{ category: { equals: categoryId } }, { tags: { in: tagIds } }],
            },
          ],
        },
        limit: Number(limit),
        sort: '-publishedAt',
      })

      return Response.json({
        success: true,
        posts: related.docs,
      })
    } catch (error) {
      return Response.json(
        { success: false, error: 'Failed to fetch related posts' },
        { status: 500 },
      )
    }
  },
}
