// src/app/api/dashboard-stats/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Verify user from headers (includes cookies)
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) {
      return Response.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    // Only admins and editors can view dashboard
    const userRole = (user as any).role
    if (userRole !== 'admin' && userRole !== 'editor') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

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
      allDeletionFeedback,
    ] = await Promise.all([
      // Posts stats
      payload.find({ collection: 'posts', limit: 0 }),
      payload.find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        limit: 0,
      }),
      payload.find({
        collection: 'posts',
        where: { status: { equals: 'draft' } },
        limit: 0,
      }),
      // Comments stats
      payload.find({ collection: 'comments', limit: 0 }),
      payload.find({
        collection: 'comments',
        where: { status: { equals: 'pending' } },
        limit: 0,
      }),
      // Other collections
      payload.find({ collection: 'users', limit: 0 }),
      payload.find({ collection: 'categories', limit: 0 }),
      payload.find({ collection: 'tags', limit: 0 }),
      // Recent and top posts
      payload.find({
        collection: 'posts',
        limit: 5,
        sort: '-createdAt',
      }),
      payload.find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        limit: 5,
        sort: '-views',
      }),
      payload.find({
        collection: 'comments',
        limit: 5,
        sort: '-createdAt',
      }),
      // Deletion feedback
      payload.find({
        collection: 'deletion-feedback' as any,
        limit: 100,
        sort: '-createdAt',
      }),
    ])

    // Aggregate deletion reasons
    const deletionReasonCounts: Record<string, number> = {}
    allDeletionFeedback.docs.forEach((feedback: any) => {
      const reason = feedback.reason || 'unknown'
      deletionReasonCounts[reason] = (deletionReasonCounts[reason] || 0) + 1
    })

    const deletionReasons = Object.entries(deletionReasonCounts)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)

    // Fetch all posts for analytics and views calculation in one query
    const allPostsForAnalytics = await payload.find({
      collection: 'posts',
      limit: 10000, // High limit to get all posts
      pagination: false,
    })

    // Calculate total views from all posts
    const totalViews = allPostsForAnalytics.docs.reduce((sum, post) => sum + ((post as any).views || 0), 0)

    // Generate monthly analytics efficiently
    const now = new Date()
    const monthlyAnalytics = []

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
          const publishedAt = (post as any).publishedAt ? new Date((post as any).publishedAt) : null
          return (
            publishedAt &&
            publishedAt >= monthDate &&
            publishedAt < nextMonthDate &&
            (post as any).status === 'published'
          )
        })
        .reduce((sum, post) => sum + ((post as any).views || 0), 0)

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
      // User deletion stats
      totalDeletedUsers: allDeletionFeedback.totalDocs,
      deletionReasons,
      recentDeletions: allDeletionFeedback.docs.slice(0, 5),
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 },
    )
  }
}
