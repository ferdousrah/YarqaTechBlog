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
}

export default function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard-stats')
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error('Dashboard fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h3>
          <p className="text-red-600 font-semibold text-lg mb-2">Failed to load dashboard</p>
          <p className="text-gray-500 text-sm">Please refresh the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
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
      </div>
    </div>
  )
}
