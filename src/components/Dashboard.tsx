'use client'

import React, { useEffect, useState, useRef } from 'react'

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
}

interface AnalyticsStats {
  totalUniqueVisitors: number
  uniqueVisitorsToday: number
  uniqueVisitorsInRange: number
  totalPageViews: number
  pageViewsToday: number
  pageViewsInRange: number
  currentOnline: number
  visitorsTrend: number
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
  dateRange: string
  rangeLabel: string
}

type DateRange = '7d' | '30d' | '6m' | '1y' | 'custom'

const styles = {
  container: {
    backgroundColor: '#f8fafc',
    padding: '32px',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  } as React.CSSProperties,
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
  } as React.CSSProperties,
  subtitle: {
    color: '#6b7280',
    marginTop: '4px',
  } as React.CSSProperties,
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  } as React.CSSProperties,
  gridFour: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  } as React.CSSProperties,
  gridThree: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  } as React.CSSProperties,
  statCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    marginBottom: '16px',
  } as React.CSSProperties,
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '4px',
  } as React.CSSProperties,
  statLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '4px',
  } as React.CSSProperties,
  statSubtext: {
    fontSize: '0.75rem',
    color: '#6b7280',
  } as React.CSSProperties,
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  listItem: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    marginBottom: '8px',
  } as React.CSSProperties,
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600,
  } as React.CSSProperties,
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    overflow: 'hidden',
  } as React.CSSProperties,
  progressFill: {
    height: '100%',
    borderRadius: '9999px',
  } as React.CSSProperties,
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '8px',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  filterButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  filterButtonActive: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  trendBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
  } as React.CSSProperties,
  dropdown: {
    position: 'relative' as const,
  } as React.CSSProperties,
  dropdownButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#10b981',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  dropdownMenu: {
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    marginTop: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    border: '1px solid #e5e7eb',
    minWidth: '200px',
    zIndex: 50,
    overflow: 'hidden',
  } as React.CSSProperties,
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    textDecoration: 'none',
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: 500,
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
  } as React.CSSProperties,
  dateInput: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '0.875rem',
    color: '#374151',
    backgroundColor: '#ffffff',
  } as React.CSSProperties,
  lineChartContainer: {
    position: 'relative' as const,
    height: '250px',
    padding: '20px 0',
  } as React.CSSProperties,
}

// CSS for animations
const animationStyles = `
  @keyframes drawLine {
    from {
      stroke-dashoffset: 2000;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-line {
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    animation: drawLine 1.5s ease-out forwards;
  }
  .animate-line-delayed {
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    animation: drawLine 1.5s ease-out 0.3s forwards;
  }
  .animate-dot {
    opacity: 0;
    animation: fadeInUp 0.3s ease-out forwards;
  }
`

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>('7d')
  const [customFromDate, setCustomFromDate] = useState('')
  const [customToDate, setCustomToDate] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [quickActionsOpen, setQuickActionsOpen] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [chartKey, setChartKey] = useState(0) // For re-triggering animation
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setQuickActionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchStats = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await fetch('/api/dashboard-stats', {
        credentials: 'include',
      })

      if (!res.ok) {
        setStats(null)
        return
      }

      const data = await res.json()
      if (data && typeof data.totalPosts !== 'undefined') {
        setStats(data)
        setLastUpdated(new Date())
      } else {
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

  const fetchAnalytics = async (range: DateRange, from?: string, to?: string, silent = false) => {
    if (!silent) setAnalyticsLoading(true)
    try {
      let url = `/api/analytics-stats?range=${range}`
      if (range === 'custom' && from && to) {
        url = `/api/analytics-stats?from=${from}&to=${to}`
      }

      const res = await fetch(url, {
        credentials: 'include',
      })

      if (!res.ok) {
        setAnalyticsStats(null)
        return
      }

      const data = await res.json()
      setAnalyticsStats(data)
      setChartKey(prev => prev + 1) // Trigger chart animation
    } catch (err) {
      console.error('Analytics fetch failed:', err)
      setAnalyticsStats(null)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([
      fetchStats(true),
      fetchAnalytics(dateRange, customFromDate, customToDate, true)
    ])
  }

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range)
    if (range !== 'custom') {
      setShowDatePicker(false)
      fetchAnalytics(range, undefined, undefined, false)
    } else {
      setShowDatePicker(true)
    }
  }

  const handleCustomDateApply = () => {
    if (customFromDate && customToDate) {
      fetchAnalytics('custom', customFromDate, customToDate, false)
      setShowDatePicker(false)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchAnalytics(dateRange)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats(true)
      fetchAnalytics(dateRange, customFromDate, customToDate, true)
    }, 30000)
    return () => clearInterval(interval)
  }, [dateRange, customFromDate, customToDate])

  // Calculate chart dimensions
  const chartWidth = 800
  const chartHeight = 200
  const padding = { top: 20, right: 20, bottom: 30, left: 50 }

  // Generate line chart path
  const generateLinePath = (data: { date: string; visitors: number; pageViews: number }[], key: 'visitors' | 'pageViews') => {
    if (!data || data.length === 0) return ''

    const maxValue = Math.max(...data.map(d => Math.max(d.visitors, d.pageViews)), 1)
    const xStep = (chartWidth - padding.left - padding.right) / (data.length - 1 || 1)

    return data.map((d, i) => {
      const x = padding.left + i * xStep
      const y = chartHeight - padding.bottom - ((d[key] / maxValue) * (chartHeight - padding.top - padding.bottom))
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  // Get points for dots
  const getChartPoints = (data: { date: string; visitors: number; pageViews: number }[], key: 'visitors' | 'pageViews') => {
    if (!data || data.length === 0) return []

    const maxValue = Math.max(...data.map(d => Math.max(d.visitors, d.pageViews)), 1)
    const xStep = (chartWidth - padding.left - padding.right) / (data.length - 1 || 1)

    return data.map((d, i) => ({
      x: padding.left + i * xStep,
      y: chartHeight - padding.bottom - ((d[key] / maxValue) * (chartHeight - padding.top - padding.bottom)),
      value: d[key],
      date: d.date,
    }))
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Loading...</p>
          </div>
        </div>
        <div style={styles.gridFour}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ ...styles.statCard, backgroundColor: '#f3f4f6', height: '140px' }}></div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={{ color: '#ef4444' }}>Failed to load dashboard data. Please refresh.</p>
          </div>
          <button onClick={handleRefresh} style={styles.button}>
            Refresh
          </button>
        </div>
      </div>
    )
  }

  const visitorPoints = analyticsStats ? getChartPoints(analyticsStats.visitorsPerDay, 'visitors') : []
  const pageViewPoints = analyticsStats ? getChartPoints(analyticsStats.visitorsPerDay, 'pageViews') : []

  return (
    <div style={styles.container}>
      <style>{animationStyles}</style>

      {/* Header with Quick Actions Dropdown */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Dashboard</h1>
          <p style={styles.subtitle}>
            Welcome back! Here's what's happening today
            {lastUpdated && <span style={{ marginLeft: '16px', fontSize: '0.75rem' }}>Last updated: {lastUpdated.toLocaleTimeString()}</span>}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Actions Dropdown */}
          <div style={styles.dropdown} ref={dropdownRef}>
            <button
              onClick={() => setQuickActionsOpen(!quickActionsOpen)}
              style={styles.dropdownButton}
            >
              <span>⚡ Quick Actions</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {quickActionsOpen && (
              <div style={styles.dropdownMenu}>
                <a href="/admin/collections/posts" style={styles.dropdownItem}>
                  <span style={{ fontSize: '1.25rem' }}>📋</span>
                  <span>All Posts</span>
                </a>
                <a href="/admin/collections/posts/create" style={styles.dropdownItem}>
                  <span style={{ fontSize: '1.25rem' }}>➕</span>
                  <span>New Post</span>
                </a>
                <a href="/admin/collections/categories/create" style={styles.dropdownItem}>
                  <span style={{ fontSize: '1.25rem' }}>📁</span>
                  <span>New Category</span>
                </a>
                <a href="/admin/collections/comments?where[status][equals]=pending" style={styles.dropdownItem}>
                  <span style={{ fontSize: '1.25rem' }}>✉️</span>
                  <span>Review Comments</span>
                </a>
                <a href="/admin/collections/media/create" style={{ ...styles.dropdownItem, borderBottom: 'none' }}>
                  <span style={{ fontSize: '1.25rem' }}>📤</span>
                  <span>Upload Media</span>
                </a>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', backgroundColor: '#dcfce7', borderRadius: '6px' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#15803d' }}>LIVE</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ ...styles.button, opacity: refreshing ? 0.6 : 1 }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ===== VISITOR ANALYTICS SECTION (FIRST) ===== */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={styles.sectionTitle}>📊 Visitor Analytics</h2>

          {/* Date Range Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { value: '7d' as DateRange, label: '7 Days' },
              { value: '30d' as DateRange, label: '30 Days' },
              { value: '6m' as DateRange, label: '6 Months' },
              { value: '1y' as DateRange, label: '1 Year' },
              { value: 'custom' as DateRange, label: 'Custom' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleDateRangeChange(option.value)}
                style={dateRange === option.value ? styles.filterButtonActive : styles.filterButton}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Range Picker */}
        {showDatePicker && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>From:</span>
            <input
              type="date"
              value={customFromDate}
              onChange={(e) => setCustomFromDate(e.target.value)}
              style={styles.dateInput}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>To:</span>
            <input
              type="date"
              value={customToDate}
              onChange={(e) => setCustomToDate(e.target.value)}
              style={styles.dateInput}
            />
            <button
              onClick={handleCustomDateApply}
              disabled={!customFromDate || !customToDate}
              style={{
                ...styles.button,
                padding: '8px 16px',
                fontSize: '0.875rem',
                opacity: (!customFromDate || !customToDate) ? 0.5 : 1,
              }}
            >
              Apply
            </button>
          </div>
        )}

        {analyticsLoading ? (
          <div style={styles.gridFour}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ ...styles.statCard, backgroundColor: '#f3f4f6', height: '140px' }}></div>
            ))}
          </div>
        ) : analyticsStats ? (
          <>
            {/* Analytics Stat Cards */}
            <div style={styles.gridFour}>
              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, backgroundColor: '#dbeafe' }}>👥</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={styles.statValue}>{analyticsStats.uniqueVisitorsInRange.toLocaleString()}</div>
                  {analyticsStats.visitorsTrend !== 0 && (
                    <span style={{
                      ...styles.trendBadge,
                      backgroundColor: analyticsStats.visitorsTrend > 0 ? '#dcfce7' : '#fee2e2',
                      color: analyticsStats.visitorsTrend > 0 ? '#166534' : '#991b1b',
                    }}>
                      {analyticsStats.visitorsTrend > 0 ? '↑' : '↓'} {Math.abs(analyticsStats.visitorsTrend)}%
                    </span>
                  )}
                </div>
                <div style={styles.statLabel}>Visitors ({analyticsStats.rangeLabel})</div>
                <div style={styles.statSubtext}>{analyticsStats.uniqueVisitorsToday} today · {analyticsStats.totalUniqueVisitors.toLocaleString()} all time</div>
              </div>

              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, backgroundColor: '#dcfce7' }}>📄</div>
                <div style={styles.statValue}>{analyticsStats.pageViewsInRange.toLocaleString()}</div>
                <div style={styles.statLabel}>Page Views ({analyticsStats.rangeLabel})</div>
                <div style={styles.statSubtext}>{analyticsStats.pageViewsToday} today</div>
              </div>

              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, backgroundColor: '#fce7f3' }}>🔴</div>
                <div style={styles.statValue}>{analyticsStats.currentOnline}</div>
                <div style={styles.statLabel}>Online Now</div>
                <div style={styles.statSubtext}>Active users</div>
              </div>

              <div style={styles.statCard}>
                <div style={{ ...styles.statIcon, backgroundColor: '#ffedd5' }}>⏱️</div>
                <div style={styles.statValue}>{Math.floor(analyticsStats.avgSessionDuration / 60)}m {analyticsStats.avgSessionDuration % 60}s</div>
                <div style={styles.statLabel}>Avg Session</div>
                <div style={styles.statSubtext}>{analyticsStats.avgPagesPerSession} pages/session</div>
              </div>
            </div>

            {/* Animated Line Chart */}
            {analyticsStats.visitorsPerDay.length > 0 && (
              <div style={{ ...styles.card, marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={styles.cardTitle}>📈 Visitor Trend</h3>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '2px' }}></span>
                      Visitors
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px' }}></span>
                      Page Views
                    </span>
                  </div>
                </div>

                {/* SVG Line Chart */}
                <div style={{ ...styles.lineChartContainer, overflow: 'visible' }}>
                  <svg
                    key={chartKey}
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    style={{ width: '100%', height: '100%', overflow: 'visible' }}
                  >
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => {
                      const y = padding.top + (i * (chartHeight - padding.top - padding.bottom) / 4)
                      return (
                        <line
                          key={i}
                          x1={padding.left}
                          y1={y}
                          x2={chartWidth - padding.right}
                          y2={y}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      )
                    })}

                    {/* Visitors line */}
                    <path
                      d={generateLinePath(analyticsStats.visitorsPerDay, 'visitors')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-line"
                    />

                    {/* Page Views line */}
                    <path
                      d={generateLinePath(analyticsStats.visitorsPerDay, 'pageViews')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-line-delayed"
                    />

                    {/* Visitor dots */}
                    {visitorPoints.map((point, i) => (
                      <g key={`visitor-${i}`}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={hoveredPoint === i ? 8 : 5}
                          fill="#3b82f6"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="animate-dot"
                          style={{ animationDelay: `${1.5 + i * 0.05}s`, cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredPoint(i)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        {hoveredPoint === i && (
                          <g>
                            <rect
                              x={point.x - 60}
                              y={point.y - 55}
                              width="120"
                              height="45"
                              rx="8"
                              fill="#1f2937"
                            />
                            <text x={point.x} y={point.y - 35} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600">
                              {point.date}
                            </text>
                            <text x={point.x} y={point.y - 18} textAnchor="middle" fill="#93c5fd" fontSize="10">
                              👥 {point.value} visitors
                            </text>
                          </g>
                        )}
                      </g>
                    ))}

                    {/* Page View dots */}
                    {pageViewPoints.map((point, i) => (
                      <circle
                        key={`pv-${i}`}
                        cx={point.x}
                        cy={point.y}
                        r={4}
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="animate-dot"
                        style={{ animationDelay: `${1.8 + i * 0.05}s` }}
                      />
                    ))}

                    {/* X-axis labels */}
                    {analyticsStats.visitorsPerDay.map((d, i) => {
                      const x = padding.left + i * ((chartWidth - padding.left - padding.right) / (analyticsStats.visitorsPerDay.length - 1 || 1))
                      // Show fewer labels if there are many data points
                      const showLabel = analyticsStats.visitorsPerDay.length <= 10 || i % Math.ceil(analyticsStats.visitorsPerDay.length / 10) === 0
                      return showLabel ? (
                        <text
                          key={i}
                          x={x}
                          y={chartHeight - 5}
                          textAnchor="middle"
                          fill="#6b7280"
                          fontSize="10"
                        >
                          {d.date}
                        </text>
                      ) : null
                    })}
                  </svg>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ ...styles.card, textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#6b7280' }}>Analytics data not available</p>
          </div>
        )}
      </div>

      {/* ===== CONTENT STATS SECTION ===== */}
      <h2 style={styles.sectionTitle}>📝 Content Overview</h2>
      <div style={styles.gridFour}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: '#dbeafe' }}>📝</div>
          <div style={styles.statValue}>{stats.totalPosts}</div>
          <div style={styles.statLabel}>Total Posts</div>
          <div style={styles.statSubtext}>{stats.publishedPosts} published · {stats.draftPosts} drafts</div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: '#dcfce7' }}>👁️</div>
          <div style={styles.statValue}>{stats.totalViews.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Views</div>
          <div style={styles.statSubtext}>All time engagement</div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: '#f3e8ff' }}>💬</div>
          <div style={styles.statValue}>{stats.totalComments}</div>
          <div style={styles.statLabel}>Comments</div>
          <div style={styles.statSubtext}>{stats.pendingComments} pending review</div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: '#fef3c7' }}>👥</div>
          <div style={styles.statValue}>{stats.totalUsers}</div>
          <div style={styles.statLabel}>Users</div>
          <div style={styles.statSubtext}>Registered members</div>
        </div>
      </div>

      {/* Visitor Behavior & Analytics Details */}
      {analyticsStats && (
        <div style={styles.gridThree}>
          {/* Visitor Behavior */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🎯 Visitor Behavior</h3>
            <div style={{ ...styles.metricRow, backgroundColor: '#dbeafe' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>New Visitors</span>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#2563eb' }}>{analyticsStats.newVsReturningRatio}%</span>
            </div>
            <div style={{ ...styles.metricRow, backgroundColor: '#dcfce7' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Bounce Rate</span>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#16a34a' }}>{analyticsStats.bounceRate}%</span>
            </div>
            <div style={{ ...styles.metricRow, backgroundColor: '#f3e8ff' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Pages/Session</span>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#9333ea' }}>{analyticsStats.avgPagesPerSession}</span>
            </div>
            <div style={{ ...styles.metricRow, backgroundColor: '#ffedd5' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Avg Time on Page</span>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ea580c' }}>
                {Math.floor(analyticsStats.avgTimeOnPage / 60)}m {analyticsStats.avgTimeOnPage % 60}s
              </span>
            </div>
          </div>

          {/* Top Countries */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🌍 Top Countries</h3>
            {analyticsStats.topCountries.length > 0 ? (
              analyticsStats.topCountries.slice(0, 5).map((country, index) => (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{country.country}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#16a34a' }}>{country.count} ({country.percentage}%)</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${country.percentage}%`, backgroundColor: '#22c55e' }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No data available</p>
            )}
          </div>

          {/* Traffic Sources */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🔗 Traffic Sources</h3>
            {analyticsStats.trafficSources.length > 0 ? (
              analyticsStats.trafficSources.slice(0, 5).map((source, index) => (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{source.source}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#3b82f6' }}>{source.count} ({source.percentage}%)</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${source.percentage}%`, backgroundColor: '#3b82f6' }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No data available</p>
            )}
          </div>
        </div>
      )}

      {/* Device & Browser + Top Pages */}
      {analyticsStats && (
        <div style={styles.gridThree}>
          {/* Device Breakdown */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📱 Device Breakdown</h3>
            {analyticsStats.deviceBreakdown.length > 0 ? (
              analyticsStats.deviceBreakdown.map((device, index) => (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', textTransform: 'capitalize' }}>{device.device}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6366f1' }}>{device.percentage}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${device.percentage}%`, backgroundColor: '#6366f1' }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No data available</p>
            )}
          </div>

          {/* Browser Breakdown */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🌐 Browser Breakdown</h3>
            {analyticsStats.browserBreakdown.length > 0 ? (
              analyticsStats.browserBreakdown.map((browser, index) => (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{browser.browser}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#ec4899' }}>{browser.percentage}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${browser.percentage}%`, backgroundColor: '#ec4899' }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No data available</p>
            )}
          </div>

          {/* Top Pages */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📊 Top Pages</h3>
            {analyticsStats.topPages.length > 0 ? (
              analyticsStats.topPages.slice(0, 5).map((page, index) => (
                <a
                  key={index}
                  href={page.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...styles.listItem, display: 'block', textDecoration: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#3b82f6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{page.path}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#f97316', marginLeft: '8px' }}>{page.count}</span>
                  </div>
                  {page.title && <p style={{ fontSize: '0.75rem', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{page.title}</p>}
                </a>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No data available</p>
            )}
          </div>
        </div>
      )}

      {/* Recent Posts, Top Posts, Recent Comments */}
      <div style={styles.gridThree}>
        {/* Recent Posts */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📝 Recent Posts</h3>
          {stats.recentPosts.length > 0 ? (
            stats.recentPosts.slice(0, 5).map((post) => (
              <a
                key={post.id}
                href={`/admin/collections/posts/${post.id}`}
                style={{ ...styles.listItem, display: 'block', textDecoration: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              >
                <div style={{ fontWeight: 600, color: '#3b82f6', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: post.status === 'published' ? '#dcfce7' : '#fef3c7',
                    color: post.status === 'published' ? '#166534' : '#92400e'
                  }}>
                    {post.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </a>
            ))
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No posts yet</p>
          )}
        </div>

        {/* Top Posts */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🔥 Top Posts</h3>
          {stats.topPosts && stats.topPosts.length > 0 ? (
            stats.topPosts.slice(0, 5).map((post, index) => (
              <a
                key={post.id}
                href={`/admin/collections/posts/${post.id}`}
                style={{ ...styles.listItem, display: 'block', textDecoration: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ fontWeight: 600, color: '#3b82f6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {post.title}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '28px' }}>
                  👁️ {(post.views || 0).toLocaleString()} views
                </div>
              </a>
            ))
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No views yet</p>
          )}
        </div>

        {/* Recent Comments */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>💬 Recent Comments</h3>
          {stats.recentComments.length > 0 ? (
            stats.recentComments.slice(0, 5).map((comment) => (
              <a
                key={comment.id}
                href={`/admin/collections/comments/${comment.id}`}
                style={{ ...styles.listItem, display: 'block', textDecoration: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              >
                <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  "{comment.content}"
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: comment.status === 'pending' ? '#fef3c7' : '#dcfce7',
                    color: comment.status === 'pending' ? '#92400e' : '#166534'
                  }}>
                    {comment.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </a>
            ))
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No comments yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
