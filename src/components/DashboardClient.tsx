'use client'

import React, { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  totalComments: number
  pendingComments: number
  totalUsers: number
  totalCategories: number
  totalTags: number
  recentPosts: any[]
  topPosts: any[]
  recentComments: any[]
  analytics?: {
    month: string
    posts: number
    views: number
  }[]
  totalDeletedUsers?: number
  deletionReasons?: { reason: string; count: number }[]
  recentDeletions?: any[]
}

interface AnalyticsStats {
  totalUniqueVisitors: number
  uniqueVisitorsToday: number
  uniqueVisitors7Days: number
  totalPageViews: number
  pageViewsToday: number
  currentOnline: number
  newVisitors: number
  returningVisitors: number
  newVsReturningRatio: number
  bounceRate: number
  avgSessionDuration: number
  avgPagesPerSession: number
  avgTimeOnPage: number
  trafficSources: { source: string; count: number; percentage: number }[]
  topCountries: { country: string; count: number; percentage: number }[]
  deviceBreakdown: { device: string; count: number; percentage: number }[]
  browserBreakdown: { browser: string; count: number; percentage: number }[]
  topPages: { path: string; count: number; title: string }[]
  visitorsPerDay: { date: string; visitors: number; pageViews: number }[]
  hourlyTraffic: { hour: string; visitors: number }[]
}

const deletionReasonLabels: Record<string, string> = {
  not_relevant: 'Not finding relevant content',
  too_many_emails: 'Too many emails/notifications',
  privacy: 'Privacy concerns',
  better_alternative: 'Found a better alternative',
  technical_issues: 'Technical issues',
  not_using: 'Not using the platform anymore',
  other: 'Other',
}

export default function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await fetch('/api/dashboard-stats', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        console.error('Dashboard fetch failed with status:', res.status)
        setStats(null)
        return
      }

      const data = await res.json()

      // Validate response structure
      if (data && typeof data.totalPosts !== 'undefined') {
        setStats(data)
        setLastUpdated(new Date())
      } else {
        console.error('Invalid dashboard data structure:', data)
        setStats(null)
      }
    } catch (err) {
      console.error('Dashboard fetch failed:', err)
      setStats(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchAnalytics = async (silent = false) => {
    if (!silent) setAnalyticsLoading(true)
    try {
      const res = await fetch('/api/analytics-stats', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        console.error('Analytics fetch failed with status:', res.status)
        setAnalyticsStats(null)
        return
      }

      const data = await res.json()
      setAnalyticsStats(data)
    } catch (err) {
      console.error('Analytics fetch failed:', err)
      setAnalyticsStats(null)
    } finally {
      setAnalyticsLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchStats(true), fetchAnalytics(true)])
  }

  // Initial fetch
  useEffect(() => {
    fetchStats()
    fetchAnalytics()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats(true)
      fetchAnalytics(true)
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
        <div className="w-full">
          <div className="h-10 bg-gray-200 rounded-xl w-72 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-white rounded-3xl shadow animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h3>
            <p className="text-red-600 font-semibold text-lg mb-2">Failed to load dashboard</p>
            <p className="text-gray-500 text-sm">Please refresh the page</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl text-4xl">
                📊
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-600 text-lg font-medium mt-1">
                  Welcome back! Here's what's happening today ✨
                </p>
              </div>
            </div>

            {/* Refresh Button and Last Updated */}
            <div className="flex items-center gap-4">
              {/* Live Badge */}
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 border border-green-300 rounded-lg">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-xs font-bold text-green-700">LIVE</span>
              </div>

              {lastUpdated && (
                <div className="text-sm text-gray-500 font-medium">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`
                  px-6 py-3 rounded-xl font-bold transition-all duration-300
                  flex items-center gap-2 shadow-lg
                  ${refreshing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl hover:scale-105'
                  }
                `}
              >
                <svg
                  className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div className="bg-blue-100 p-4 rounded-2xl text-3xl">📝</div>
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-2">{stats.totalPosts}</h3>
              <p className="text-base font-bold text-gray-700 mb-1">Total Posts</p>
              <p className="text-xs text-gray-500 font-medium">
                {stats.publishedPosts} published · {stats.draftPosts} drafts
              </p>
            </div>
          </div>

          <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100 rounded-full opacity-30"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div className="bg-green-100 p-4 rounded-2xl text-3xl">👁️</div>
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-2">
                {stats.totalViews.toLocaleString()}
              </h3>
              <p className="text-base font-bold text-gray-700 mb-1">Total Views</p>
              <p className="text-xs text-gray-500 font-medium">All time engagement</p>
            </div>
          </div>

          <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-100 rounded-full opacity-30"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div className="bg-purple-100 p-4 rounded-2xl text-3xl">💬</div>
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-2">{stats.totalComments}</h3>
              <p className="text-base font-bold text-gray-700 mb-1">Comments</p>
              <p className="text-xs text-gray-500 font-medium">
                {stats.pendingComments} awaiting review
              </p>
            </div>
          </div>

          <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100 rounded-full opacity-30"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div className="bg-orange-100 p-4 rounded-2xl text-3xl">👥</div>
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-2">{stats.totalUsers}</h3>
              <p className="text-base font-bold text-gray-700 mb-1">Active Users</p>
              <p className="text-xs text-gray-500 font-medium">Registered members</p>
            </div>
          </div>
        </div>

        {/* Analytics Chart */}
        {stats.analytics && stats.analytics.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-10 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg text-xl">
                    📈
                  </div>
                  Monthly Activity
                </h2>
                <p className="text-sm text-gray-500 font-medium ml-13">
                  Track your content performance over time
                </p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={stats.analytics}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  style={{ fontSize: '13px', fontWeight: '600' }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: '13px', fontWeight: '600' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '12px 16px',
                    fontWeight: '600',
                  }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                />
                <Area
                  type="monotone"
                  dataKey="posts"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fill="url(#colorPosts)"
                  name="Posts"
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#10b981"
                  strokeWidth={4}
                  fill="url(#colorViews)"
                  name="Views"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl font-black text-gray-900">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <a
              href="/admin/collections/posts/create"
              className="bg-white hover:bg-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 flex flex-col items-center text-center gap-4 no-underline"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-3xl">
                ➕
              </div>
              <span className="text-sm font-bold text-gray-700">New Post</span>
            </a>

            <a
              href="/admin/collections/categories/create"
              className="bg-white hover:bg-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 flex flex-col items-center text-center gap-4 no-underline"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg text-3xl">
                📁
              </div>
              <span className="text-sm font-bold text-gray-700">New Category</span>
            </a>

            <a
              href="/admin/collections/comments?where[status][equals]=pending"
              className="bg-white hover:bg-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 flex flex-col items-center text-center gap-4 no-underline"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg text-3xl">
                ✉️
              </div>
              <span className="text-sm font-bold text-gray-700">Review Comments</span>
            </a>

            <a
              href="/admin/collections/media/create"
              className="bg-white hover:bg-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 flex flex-col items-center text-center gap-4 no-underline"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg text-3xl">
                📤
              </div>
              <span className="text-sm font-bold text-gray-700">Upload Media</span>
            </a>
          </div>
        </div>

        {/* Recent Posts, Top Posts & Comments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Posts */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg text-xl">
                📝
              </div>
              Recent Posts
            </h2>

            {stats.recentPosts.length > 0 ? (
              <div className="space-y-3">
                {stats.recentPosts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="p-5 rounded-2xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 hover:shadow-md"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate mb-2">{post.title}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                              post.status === 'published'
                                ? 'bg-gradient-to-r from-green-500 to-green-600'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600'
                            }`}
                          >
                            {post.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <a
                        href={`/admin/collections/posts/${post.id}`}
                        className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-all no-underline"
                      >
                        Edit
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-600 font-semibold mb-2">No posts yet</p>
                <a
                  href="/admin/collections/posts/create"
                  className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg no-underline"
                >
                  Create First Post
                </a>
              </div>
            )}
          </div>

          {/* Top Posts by Views */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg text-xl">
                🔥
              </div>
              Top Posts by Views
            </h2>

            {stats.topPosts && stats.topPosts.length > 0 ? (
              <div className="space-y-3">
                {stats.topPosts.slice(0, 5).map((post, index) => (
                  <div
                    key={post.id}
                    className="p-5 rounded-2xl hover:bg-green-50 transition-all border border-transparent hover:border-green-100 hover:shadow-md"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white text-xs font-bold">
                            {index + 1}
                          </span>
                          <p className="font-bold text-gray-900 truncate flex-1">{post.title}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm">
                            👁️ {(post.views || 0).toLocaleString()} views
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            {new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <a
                        href={`/admin/collections/posts/${post.id}`}
                        className="flex-shrink-0 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow transition-all no-underline"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔥</div>
                <p className="text-gray-600 font-semibold mb-2">No views yet</p>
                <p className="text-gray-500 text-sm">Top posts will appear here</p>
              </div>
            )}
          </div>

          {/* Recent Comments */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg text-xl">
                💬
              </div>
              Recent Comments
            </h2>

            {stats.recentComments.length > 0 ? (
              <div className="space-y-3">
                {stats.recentComments.slice(0, 5).map((comment) => (
                  <div
                    key={comment.id}
                    className="p-5 rounded-2xl hover:bg-purple-50 transition-all border border-transparent hover:border-purple-100 hover:shadow-md"
                  >
                    <p className="text-gray-800 text-sm font-medium mb-3 line-clamp-2">
                      "{comment.content}"
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                          comment.status === 'pending'
                            ? 'bg-gradient-to-r from-orange-500 to-red-600'
                            : 'bg-gradient-to-r from-green-500 to-green-600'
                        }`}
                      >
                        {comment.status === 'pending' ? 'Pending' : 'Approved'}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-600 font-semibold mb-2">No comments yet</p>
                <p className="text-gray-500 text-sm">Comments will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* User Deletion Stats */}
        {(stats.totalDeletedUsers !== undefined && stats.totalDeletedUsers > 0) && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
              <h2 className="text-2xl font-black text-gray-900">User Churn Analytics</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Deletion Summary Card */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg text-3xl">
                    👋
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900">{stats.totalDeletedUsers}</h3>
                    <p className="text-sm font-bold text-gray-600">Users Left</p>
                  </div>
                </div>

                {stats.deletionReasons && stats.deletionReasons.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-gray-700 mb-3">Top Reasons</p>
                    {stats.deletionReasons.slice(0, 5).map((item, index) => (
                      <div key={item.reason} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-700">
                            {deletionReasonLabels[item.reason] || item.reason}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Deletions */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg text-xl">
                    📋
                  </div>
                  Recent Feedback
                </h3>

                {stats.recentDeletions && stats.recentDeletions.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentDeletions.slice(0, 5).map((deletion: any) => (
                      <div
                        key={deletion.id}
                        className="p-4 rounded-2xl bg-gray-50 border border-gray-100"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-bold text-gray-900">
                            {deletion.userEmail}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(deletion.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg">
                          {deletionReasonLabels[deletion.reason] || deletion.reason}
                        </span>
                        {deletion.feedback && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            "{deletion.feedback}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-gray-500 text-sm">No feedback yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {analyticsStats && (
          <div className="mt-12">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl text-2xl">
                📊
              </div>
              Visitor Analytics
            </h2>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
                    👥
                  </div>
                  <p className="text-sm text-gray-500 font-bold">Total Visitors</p>
                </div>
                <p className="text-4xl font-black bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {analyticsStats.totalUniqueVisitors.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analyticsStats.uniqueVisitorsToday} today
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white text-xl">
                    📄
                  </div>
                  <p className="text-sm text-gray-500 font-bold">Page Views</p>
                </div>
                <p className="text-4xl font-black bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {analyticsStats.totalPageViews.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analyticsStats.pageViewsToday} today
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                    🔴
                  </div>
                  <p className="text-sm text-gray-500 font-bold">Online Now</p>
                </div>
                <p className="text-4xl font-black bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {analyticsStats.currentOnline}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active users</p>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl">
                    ⏱️
                  </div>
                  <p className="text-sm text-gray-500 font-bold">Avg Session</p>
                </div>
                <p className="text-4xl font-black bg-gradient-to-br from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {Math.floor(analyticsStats.avgSessionDuration / 60)}m
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analyticsStats.avgSessionDuration % 60}s duration
                </p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Visitors Chart (Last 7 Days) */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg text-xl">
                    📈
                  </div>
                  Visitors (Last 7 Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsStats.visitorsPerDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      name="Visitors"
                    />
                    <Line
                      type="monotone"
                      dataKey="pageViews"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 4 }}
                      name="Page Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Traffic Sources (Pie Chart) */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg text-xl">
                    🔗
                  </div>
                  Traffic Sources
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsStats.trafficSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, percentage }) => `${source}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsStats.trafficSources.map((entry, index) => {
                        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      })}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Visitor Behavior */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg text-xl">
                    🎯
                  </div>
                  Visitor Behavior
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50">
                    <span className="text-sm font-bold text-gray-700">New Visitors</span>
                    <span className="text-lg font-black text-blue-600">
                      {analyticsStats.newVsReturningRatio}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                    <span className="text-sm font-bold text-gray-700">Bounce Rate</span>
                    <span className="text-lg font-black text-green-600">
                      {analyticsStats.bounceRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
                    <span className="text-sm font-bold text-gray-700">Pages/Session</span>
                    <span className="text-lg font-black text-purple-600">
                      {analyticsStats.avgPagesPerSession}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50">
                    <span className="text-sm font-bold text-gray-700">Avg Time on Page</span>
                    <span className="text-lg font-black text-orange-600">
                      {Math.floor(analyticsStats.avgTimeOnPage / 60)}m {analyticsStats.avgTimeOnPage % 60}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Countries */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg text-xl">
                    🌍
                  </div>
                  Top Countries
                </h3>
                <div className="space-y-3">
                  {analyticsStats.topCountries.slice(0, 5).map((country, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">{country.country}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            style={{ width: `${country.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-black text-green-600">
                          {country.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Pages */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg text-xl">
                    📊
                  </div>
                  Top Pages
                </h3>
                <div className="space-y-3">
                  {analyticsStats.topPages.slice(0, 5).map((page, index) => (
                    <div key={index} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-gray-500 font-medium truncate flex-1">
                          {page.path}
                        </span>
                        <span className="text-sm font-black text-amber-600 ml-2">
                          {page.count}
                        </span>
                      </div>
                      {page.title && (
                        <p className="text-xs text-gray-600 truncate">{page.title}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Device & Browser Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Device Breakdown */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg text-xl">
                    📱
                  </div>
                  Device Breakdown
                </h3>
                <div className="space-y-4">
                  {analyticsStats.deviceBreakdown.map((device, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-700 capitalize">
                          {device.device}
                        </span>
                        <span className="text-sm font-black text-indigo-600">
                          {device.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browser Breakdown */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg text-xl">
                    🌐
                  </div>
                  Browser Breakdown
                </h3>
                <div className="space-y-4">
                  {analyticsStats.browserBreakdown.map((browser, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-700">{browser.browser}</span>
                        <span className="text-sm font-black text-rose-600">
                          {browser.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-rose-500 to-pink-500 h-3 rounded-full"
                          style={{ width: `${browser.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
