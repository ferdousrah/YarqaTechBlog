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

// Inline styles
const styles = {
  container: {
    backgroundColor: '#f8fafc',
    padding: '32px',
  } as React.CSSProperties,
  card: {
    background: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    border: '1px solid #f3f4f6',
    marginBottom: '24px',
  } as React.CSSProperties,
  statCard: {
    background: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    border: '1px solid #f3f4f6',
    position: 'relative' as const,
    overflow: 'hidden',
  } as React.CSSProperties,
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 900,
    color: '#111827',
    marginBottom: '8px',
  } as React.CSSProperties,
  statLabel: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#374151',
    marginBottom: '4px',
  } as React.CSSProperties,
  statSubtext: {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontWeight: 500,
  } as React.CSSProperties,
  gridFour: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '40px',
  } as React.CSSProperties,
  gridThree: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '40px',
  } as React.CSSProperties,
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '32px',
    marginBottom: '32px',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px',
  } as React.CSSProperties,
  headerTitle: {
    fontSize: '3rem',
    fontWeight: 900,
    background: 'linear-gradient(to right, #2563eb, #9333ea)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } as React.CSSProperties,
  headerSubtitle: {
    color: '#4b5563',
    fontSize: '1.125rem',
    fontWeight: 500,
    marginTop: '4px',
  } as React.CSSProperties,
  button: {
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    border: 'none',
    background: 'linear-gradient(to right, #2563eb, #9333ea)',
    color: '#ffffff',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 900,
    color: '#111827',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,
  listItem: {
    padding: '20px',
    borderRadius: '16px',
    marginBottom: '12px',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#ffffff',
  } as React.CSSProperties,
  link: {
    textDecoration: 'none',
    color: 'inherit',
  } as React.CSSProperties,
  quickActionCard: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    border: '1px solid #f3f4f6',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    gap: '16px',
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
  } as React.CSSProperties,
  quickActionIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.875rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '12px',
    marginBottom: '8px',
  } as React.CSSProperties,
  progressBar: {
    width: '96px',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    overflow: 'hidden',
  } as React.CSSProperties,
  progressFill: {
    height: '100%',
    borderRadius: '9999px',
  } as React.CSSProperties,
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

  useEffect(() => {
    fetchStats()
    fetchAnalytics()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats(true)
      fetchAnalytics(true)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ width: '100%' }}>
          <div style={{ height: '40px', background: '#e5e7eb', borderRadius: '12px', width: '288px', marginBottom: '32px' }}></div>
          <div style={styles.gridFour}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ ...styles.statCard, height: '160px', background: '#f3f4f6' }}></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div style={{ ...styles.card, maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📊</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Oops!</h3>
            <p style={{ color: '#dc2626', fontWeight: 600, fontSize: '1.125rem', marginBottom: '8px' }}>Failed to load dashboard</p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Please refresh the page</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={{ width: '100%' }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ ...styles.iconBox, width: '64px', height: '64px', background: 'linear-gradient(to bottom right, #3b82f6, #9333ea)', fontSize: '2.5rem' }}>
              📊
            </div>
            <div>
              <h1 style={styles.headerTitle}>Dashboard</h1>
              <p style={styles.headerSubtitle}>Welcome back! Here's what's happening today ✨</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>LIVE</span>
            </div>

            {lastUpdated && (
              <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}

            <button onClick={handleRefresh} disabled={refreshing} style={{ ...styles.button, opacity: refreshing ? 0.5 : 1 }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={styles.gridFour}>
          <div style={styles.statCard}>
            <div style={{ ...styles.iconBox, background: '#dbeafe', marginBottom: '20px', fontSize: '1.875rem' }}>📝</div>
            <h3 style={styles.statValue}>{stats.totalPosts}</h3>
            <p style={styles.statLabel}>Total Posts</p>
            <p style={styles.statSubtext}>{stats.publishedPosts} published · {stats.draftPosts} drafts</p>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.iconBox, background: '#dcfce7', marginBottom: '20px', fontSize: '1.875rem' }}>👁️</div>
            <h3 style={styles.statValue}>{stats.totalViews.toLocaleString()}</h3>
            <p style={styles.statLabel}>Total Views</p>
            <p style={styles.statSubtext}>All time engagement</p>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.iconBox, background: '#f3e8ff', marginBottom: '20px', fontSize: '1.875rem' }}>💬</div>
            <h3 style={styles.statValue}>{stats.totalComments}</h3>
            <p style={styles.statLabel}>Comments</p>
            <p style={styles.statSubtext}>{stats.pendingComments} awaiting review</p>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.iconBox, background: '#ffedd5', marginBottom: '20px', fontSize: '1.875rem' }}>👥</div>
            <h3 style={styles.statValue}>{stats.totalUsers}</h3>
            <p style={styles.statLabel}>Active Users</p>
            <p style={styles.statSubtext}>Registered members</p>
          </div>
        </div>

        {/* Analytics Chart */}
        {stats.analytics && stats.analytics.length > 0 && (
          <div style={{ ...styles.card, padding: '32px' }}>
            <h2 style={styles.sectionTitle}>
              <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #3b82f6, #9333ea)' }}>📈</div>
              Monthly Activity
            </h2>
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
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '13px', fontWeight: 600 }} tickLine={false} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '13px', fontWeight: 600 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '2px solid #e5e7eb', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px 16px', fontWeight: 600 }} />
                <Area type="monotone" dataKey="posts" stroke="#6366f1" strokeWidth={4} fill="url(#colorPosts)" name="Posts" />
                <Area type="monotone" dataKey="views" stroke="#10b981" strokeWidth={4} fill="url(#colorViews)" name="Views" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={styles.sectionTitle}>
            <div style={{ width: '8px', height: '32px', background: 'linear-gradient(to bottom, #2563eb, #9333ea)', borderRadius: '4px' }}></div>
            Quick Actions
          </h2>

          <div style={styles.gridFour}>
            <a href="/admin/collections/posts/create" style={styles.quickActionCard}>
              <div style={{ ...styles.quickActionIcon, background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)' }}>➕</div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>New Post</span>
            </a>

            <a href="/admin/collections/categories/create" style={styles.quickActionCard}>
              <div style={{ ...styles.quickActionIcon, background: 'linear-gradient(to bottom right, #22c55e, #14b8a6)' }}>📁</div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>New Category</span>
            </a>

            <a href="/admin/collections/comments?where[status][equals]=pending" style={styles.quickActionCard}>
              <div style={{ ...styles.quickActionIcon, background: 'linear-gradient(to bottom right, #a855f7, #ec4899)' }}>✉️</div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Review Comments</span>
            </a>

            <a href="/admin/collections/media/create" style={styles.quickActionCard}>
              <div style={{ ...styles.quickActionIcon, background: 'linear-gradient(to bottom right, #f97316, #ef4444)' }}>📤</div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Upload Media</span>
            </a>
          </div>
        </div>

        {/* Recent Posts, Top Posts & Comments */}
        <div style={styles.gridThree}>
          {/* Recent Posts */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)' }}>📝</div>
              Recent Posts
            </h2>

            {stats.recentPosts.length > 0 ? (
              <div>
                {stats.recentPosts.slice(0, 5).map((post) => (
                  <div key={post.id} style={{ ...styles.listItem, background: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, color: '#111827', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ ...styles.badge, background: post.status === 'published' ? 'linear-gradient(to right, #22c55e, #16a34a)' : 'linear-gradient(to right, #f97316, #ea580c)' }}>
                            {post.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>
                            {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <a href={`/admin/collections/posts/${post.id}`} style={{ ...styles.link, padding: '8px 16px', background: '#2563eb', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, borderRadius: '12px' }}>
                        Edit
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📝</div>
                <p style={{ color: '#4b5563', fontWeight: 600, marginBottom: '8px' }}>No posts yet</p>
                <a href="/admin/collections/posts/create" style={{ ...styles.link, display: 'inline-block', marginTop: '16px', padding: '12px 24px', background: 'linear-gradient(to right, #3b82f6, #2563eb)', color: '#ffffff', fontWeight: 700, borderRadius: '12px' }}>
                  Create First Post
                </a>
              </div>
            )}
          </div>

          {/* Top Posts by Views */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #22c55e, #14b8a6)' }}>🔥</div>
              Top Posts by Views
            </h2>

            {stats.topPosts && stats.topPosts.length > 0 ? (
              <div>
                {stats.topPosts.slice(0, 5).map((post, index) => (
                  <div key={post.id} style={{ ...styles.listItem, background: '#f0fdf4' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(to bottom right, #22c55e, #14b8a6)', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700 }}>
                            {index + 1}
                          </span>
                          <p style={{ fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{post.title}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ ...styles.badge, background: 'linear-gradient(to right, #22c55e, #16a34a)' }}>
                            👁️ {(post.views || 0).toLocaleString()} views
                          </span>
                        </div>
                      </div>
                      <a href={`/admin/collections/posts/${post.id}`} style={{ ...styles.link, padding: '8px 16px', background: '#16a34a', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, borderRadius: '12px' }}>
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔥</div>
                <p style={{ color: '#4b5563', fontWeight: 600, marginBottom: '8px' }}>No views yet</p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Top posts will appear here</p>
              </div>
            )}
          </div>

          {/* Recent Comments */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #a855f7, #ec4899)' }}>💬</div>
              Recent Comments
            </h2>

            {stats.recentComments.length > 0 ? (
              <div>
                {stats.recentComments.slice(0, 5).map((comment) => (
                  <div key={comment.id} style={{ ...styles.listItem, background: '#faf5ff' }}>
                    <p style={{ color: '#1f2937', fontSize: '0.875rem', fontWeight: 500, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{comment.content}"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ ...styles.badge, background: comment.status === 'pending' ? 'linear-gradient(to right, #f97316, #ef4444)' : 'linear-gradient(to right, #22c55e, #16a34a)' }}>
                        {comment.status === 'pending' ? 'Pending' : 'Approved'}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💬</div>
                <p style={{ color: '#4b5563', fontWeight: 600, marginBottom: '8px' }}>No comments yet</p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Comments will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Section */}
        {analyticsStats && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ ...styles.headerTitle, fontSize: '1.875rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ ...styles.iconBox, width: '48px', height: '48px', background: 'linear-gradient(to bottom right, #22c55e, #10b981)', fontSize: '1.5rem' }}>📊</div>
              Visitor Analytics
            </h2>

            {/* Overview Stats */}
            <div style={styles.gridFour}>
              <div style={styles.statCard}>
                <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #60a5fa, #3b82f6)', marginBottom: '8px' }}>👥</div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 700 }}>Total Visitors</p>
                <p style={{ ...styles.statValue, background: 'linear-gradient(to bottom right, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {analyticsStats.totalUniqueVisitors.toLocaleString()}
                </p>
                <p style={styles.statSubtext}>{analyticsStats.uniqueVisitorsToday} today</p>
              </div>

              <div style={styles.statCard}>
                <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #4ade80, #22c55e)', marginBottom: '8px' }}>📄</div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 700 }}>Page Views</p>
                <p style={{ ...styles.statValue, background: 'linear-gradient(to bottom right, #16a34a, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {analyticsStats.totalPageViews.toLocaleString()}
                </p>
                <p style={styles.statSubtext}>{analyticsStats.pageViewsToday} today</p>
              </div>

              <div style={styles.statCard}>
                <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #c084fc, #a855f7)', marginBottom: '8px' }}>🔴</div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 700 }}>Online Now</p>
                <p style={{ ...styles.statValue, background: 'linear-gradient(to bottom right, #9333ea, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {analyticsStats.currentOnline}
                </p>
                <p style={styles.statSubtext}>Active users</p>
              </div>

              <div style={styles.statCard}>
                <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #fb923c, #f97316)', marginBottom: '8px' }}>⏱️</div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 700 }}>Avg Session</p>
                <p style={{ ...styles.statValue, background: 'linear-gradient(to bottom right, #ea580c, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {Math.floor(analyticsStats.avgSessionDuration / 60)}m
                </p>
                <p style={styles.statSubtext}>{analyticsStats.avgSessionDuration % 60}s duration</p>
              </div>
            </div>

            {/* Charts Row */}
            <div style={styles.gridTwo}>
              <div style={{ ...styles.card, padding: '32px' }}>
                <h3 style={styles.sectionTitle}>
                  <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #3b82f6, #6366f1)' }}>📈</div>
                  Visitors (Last 7 Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsStats.visitorsPerDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} name="Visitors" />
                    <Line type="monotone" dataKey="pageViews" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} name="Page Views" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ ...styles.card, padding: '32px' }}>
                <h3 style={styles.sectionTitle}>
                  <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #a855f7, #ec4899)' }}>🔗</div>
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
            <div style={styles.gridThree}>
              {/* Visitor Behavior */}
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>
                  <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #06b6d4, #3b82f6)' }}>🎯</div>
                  Visitor Behavior
                </h3>
                <div>
                  <div style={{ ...styles.metricRow, background: 'linear-gradient(to right, #dbeafe, #e0f2fe)' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>New Visitors</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#2563eb' }}>{analyticsStats.newVsReturningRatio}%</span>
                  </div>
                  <div style={{ ...styles.metricRow, background: 'linear-gradient(to right, #dcfce7, #d1fae5)' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Bounce Rate</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#16a34a' }}>{analyticsStats.bounceRate}%</span>
                  </div>
                  <div style={{ ...styles.metricRow, background: 'linear-gradient(to right, #f3e8ff, #fce7f3)' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Pages/Session</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#9333ea' }}>{analyticsStats.avgPagesPerSession}</span>
                  </div>
                  <div style={{ ...styles.metricRow, background: 'linear-gradient(to right, #ffedd5, #fee2e2)' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Avg Time on Page</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#ea580c' }}>
                      {Math.floor(analyticsStats.avgTimeOnPage / 60)}m {analyticsStats.avgTimeOnPage % 60}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Countries */}
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>
                  <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #22c55e, #10b981)' }}>🌍</div>
                  Top Countries
                </h3>
                <div>
                  {analyticsStats.topCountries.slice(0, 5).map((country, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>{country.country}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={styles.progressBar}>
                          <div style={{ ...styles.progressFill, width: `${country.percentage}%`, background: 'linear-gradient(to right, #22c55e, #10b981)' }}></div>
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 900, color: '#16a34a' }}>{country.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Pages */}
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>
                  <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #f59e0b, #f97316)' }}>📊</div>
                  Top Pages
                </h3>
                <div>
                  {analyticsStats.topPages.slice(0, 5).map((page, index) => (
                    <div key={index} style={{ padding: '12px', borderRadius: '12px', background: '#f9fafb', border: '1px solid #f3f4f6', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{page.path}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 900, color: '#d97706', marginLeft: '8px' }}>{page.count}</span>
                      </div>
                      {page.title && <p style={{ fontSize: '0.75rem', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.title}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Device & Browser Stats */}
            <div style={styles.gridTwo}>
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>
                  <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #6366f1, #a855f7)' }}>📱</div>
                  Device Breakdown
                </h3>
                <div>
                  {analyticsStats.deviceBreakdown.map((device, index) => (
                    <div key={index} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', textTransform: 'capitalize' }}>{device.device}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 900, color: '#6366f1' }}>{device.percentage}%</span>
                      </div>
                      <div style={{ ...styles.progressBar, width: '100%', height: '12px' }}>
                        <div style={{ ...styles.progressFill, width: `${device.percentage}%`, background: 'linear-gradient(to right, #6366f1, #a855f7)' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>
                  <div style={{ ...styles.iconBox, background: 'linear-gradient(to bottom right, #f43f5e, #ec4899)' }}>🌐</div>
                  Browser Breakdown
                </h3>
                <div>
                  {analyticsStats.browserBreakdown.map((browser, index) => (
                    <div key={index} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>{browser.browser}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 900, color: '#f43f5e' }}>{browser.percentage}%</span>
                      </div>
                      <div style={{ ...styles.progressBar, width: '100%', height: '12px' }}>
                        <div style={{ ...styles.progressFill, width: `${browser.percentage}%`, background: 'linear-gradient(to right, #f43f5e, #ec4899)' }}></div>
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
