// src/endpoints/dashboard-stats.ts - Payload 3.x
import type { Endpoint } from 'payload'

export const dashboardStatsEndpoint: Endpoint = {
  path: '/dashboard-stats',
  method: 'get',
  handler: async (req) => {
    // Only allow authenticated users
    if (!req.user) {
      return Response.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    // Only admins and editors can view dashboard
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    try {
      // Get total posts
      const allPosts = await req.payload.find({
        collection: 'posts',
        limit: 0,
      })

      // Get published posts
      const publishedPosts = await req.payload.find({
        collection: 'posts',
        where: {
          status: { equals: 'published' },
        },
        limit: 0,
      })

      // Get draft posts
      const draftPosts = await req.payload.find({
        collection: 'posts',
        where: {
          status: { equals: 'draft' },
        },
        limit: 0,
      })

      // Calculate total views
      const postsWithViews = await req.payload.find({
        collection: 'posts',
        limit: 1000,
      })
      const totalViews = postsWithViews.docs.reduce((sum, post) => sum + (post.views || 0), 0)

      // Get comments stats
      const allComments = await req.payload.find({
        collection: 'comments',
        limit: 0,
      })

      const pendingComments = await req.payload.find({
        collection: 'comments',
        where: {
          status: { equals: 'pending' },
        },
        limit: 0,
      })

      // Get users count
      const allUsers = await req.payload.find({
        collection: 'users',
        limit: 0,
      })

      // Get categories and tags count
      const allCategories = await req.payload.find({
        collection: 'categories',
        limit: 0,
      })

      const allTags = await req.payload.find({
        collection: 'tags',
        limit: 0,
      })

      // Get recent posts (last 5)
      const recentPosts = await req.payload.find({
        collection: 'posts',
        limit: 5,
        sort: '-createdAt',
      })

      // Get top posts by views (last 5)
      const topPosts = await req.payload.find({
        collection: 'posts',
        where: {
          status: { equals: 'published' },
        },
        limit: 5,
        sort: '-views',
      })

      // Get recent comments (last 5)
      const recentComments = await req.payload.find({
        collection: 'comments',
        limit: 5,
        sort: '-createdAt',
      })

      // Generate monthly analytics for the last 6 months
      const now = new Date()
      const monthlyAnalytics = []

      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

        // Get posts created in this month
        const monthPosts = await req.payload.find({
          collection: 'posts',
          where: {
            and: [
              { createdAt: { greater_than_equal: monthDate.toISOString() } },
              { createdAt: { less_than: nextMonthDate.toISOString() } },
            ],
          },
          limit: 0,
        })

        // Get views for posts published in this month
        const monthPublishedPosts = await req.payload.find({
          collection: 'posts',
          where: {
            and: [
              { publishedAt: { greater_than_equal: monthDate.toISOString() } },
              { publishedAt: { less_than: nextMonthDate.toISOString() } },
              { status: { equals: 'published' } },
            ],
          },
          limit: 1000,
        })

        const monthViews = monthPublishedPosts.docs.reduce((sum, post) => sum + (post.views || 0), 0)

        monthlyAnalytics.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
          posts: monthPosts.totalDocs,
          views: monthViews,
        })
      }

      return Response.json({
        totalPosts: allPosts.totalDocs,
        publishedPosts: publishedPosts.totalDocs,
        draftPosts: draftPosts.totalDocs,
        totalViews,
        totalComments: allComments.totalDocs,
        pendingComments: pendingComments.totalDocs,
        totalUsers: allUsers.totalDocs,
        totalCategories: allCategories.totalDocs,
        totalTags: allTags.totalDocs,
        recentPosts: recentPosts.docs,
        topPosts: topPosts.docs,
        recentComments: recentComments.docs,
        analytics: monthlyAnalytics,
      })
    } catch (error) {
      console.error('Dashboard stats error:', error)
      return Response.json(
        { success: false, error: 'Failed to fetch dashboard stats' },
        { status: 500 },
      )
    }
  },
}
