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
      // Fetch all data in parallel to improve performance
      const [
        allPosts,
        publishedPosts,
        draftPosts,
        allComments,
        pendingComments,
        allUsers,
        allCategories,
        allTags,
        recentPosts,
        topPosts,
        recentComments,
      ] = await Promise.all([
        // Posts stats
        req.payload.find({ collection: 'posts', limit: 0 }),
        req.payload.find({
          collection: 'posts',
          where: { status: { equals: 'published' } },
          limit: 0,
        }),
        req.payload.find({
          collection: 'posts',
          where: { status: { equals: 'draft' } },
          limit: 0,
        }),
        // Comments stats
        req.payload.find({ collection: 'comments', limit: 0 }),
        req.payload.find({
          collection: 'comments',
          where: { status: { equals: 'pending' } },
          limit: 0,
        }),
        // Other collections
        req.payload.find({ collection: 'users', limit: 0 }),
        req.payload.find({ collection: 'categories', limit: 0 }),
        req.payload.find({ collection: 'tags', limit: 0 }),
        // Recent and top posts
        req.payload.find({
          collection: 'posts',
          limit: 5,
          sort: '-createdAt',
        }),
        req.payload.find({
          collection: 'posts',
          where: { status: { equals: 'published' } },
          limit: 5,
          sort: '-views',
        }),
        req.payload.find({
          collection: 'comments',
          limit: 5,
          sort: '-createdAt',
        }),
      ])

      // Calculate total views efficiently using a single query with pagination
      const postsForViews = await req.payload.find({
        collection: 'posts',
        limit: 100, // Limit to recent posts to keep it fast
        pagination: false,
      })
      const totalViews = postsForViews.docs.reduce((sum, post) => sum + (post.views || 0), 0)

      // Generate monthly analytics efficiently
      const now = new Date()
      const monthlyAnalytics = []

      // Fetch all posts for analytics in one query
      const allPostsForAnalytics = await req.payload.find({
        collection: 'posts',
        limit: 1000,
        pagination: false,
      })

      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

        // Filter posts created in this month from the cached data
        const monthPosts = allPostsForAnalytics.docs.filter((post) => {
          const createdAt = new Date(post.createdAt)
          return createdAt >= monthDate && createdAt < nextMonthDate
        })

        // Calculate views for posts published in this month
        const monthViews = monthPosts
          .filter((post) => {
            const publishedAt = post.publishedAt ? new Date(post.publishedAt) : null
            return (
              publishedAt &&
              publishedAt >= monthDate &&
              publishedAt < nextMonthDate &&
              post.status === 'published'
            )
          })
          .reduce((sum, post) => sum + (post.views || 0), 0)

        monthlyAnalytics.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
          posts: monthPosts.length,
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
