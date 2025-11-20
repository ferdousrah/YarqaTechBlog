'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface NavGroup {
  label: string
  icon: string
  items: NavItem[]
}

interface NavItem {
  label: string
  href: string
  icon?: string
}

const navGroups: NavGroup[] = [
  {
    label: 'Content',
    icon: '📝',
    items: [
      { label: 'Posts', href: '/admin/collections/posts' },
      { label: 'Pages', href: '/admin/collections/pages' },
      { label: 'Categories', href: '/admin/collections/categories' },
      { label: 'Tags', href: '/admin/collections/tags' },
      { label: 'Media', href: '/admin/collections/media' },
    ],
  },
  {
    label: 'Users',
    icon: '👥',
    items: [
      { label: 'Users', href: '/admin/collections/users' },
    ],
  },
  {
    label: 'Engagement',
    icon: '💬',
    items: [
      { label: 'Comments', href: '/admin/collections/comments' },
      { label: 'Bookmarks', href: '/admin/collections/bookmarks' },
      { label: 'Post Reactions', href: '/admin/collections/post-reactions' },
    ],
  },
  {
    label: 'Analytics',
    icon: '📊',
    items: [
      { label: 'Visitor Sessions', href: '/admin/collections/visitor-sessions' },
      { label: 'Page Views', href: '/admin/collections/page-views' },
      { label: 'Post Views', href: '/admin/collections/post-views' },
      { label: 'Reading Progress', href: '/admin/collections/reading-progress' },
      { label: 'Search Queries', href: '/admin/collections/search-queries' },
      { label: 'Deletion Feedback', href: '/admin/collections/deletion-feedback' },
      { label: 'Logout Feedback', href: '/admin/collections/logout-feedback' },
    ],
  },
  {
    label: 'Marketing',
    icon: '📧',
    items: [
      { label: 'Newsletter', href: '/admin/collections/newsletter-subscribers' },
    ],
  },
]

export default function CustomAdminNav() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev =>
      prev.includes(label)
        ? prev.filter(g => g !== label)
        : [...prev, label]
    )
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav id="custom-admin-nav-root">
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="custom-nav-logo"
      >
        <Link href="/admin" className="custom-nav-logo-link">
          <span className="custom-nav-logo-icon">🚀</span>
          <span className="custom-nav-logo-text">Yarqa Tech</span>
        </Link>
      </motion.div>

      {/* Dashboard Link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link
          href="/admin"
          className={`custom-nav-dashboard ${isActive('/admin') ? 'active' : ''}`}
        >
          <span>📊</span>
          <span>Dashboard</span>
        </Link>
      </motion.div>

      {/* Navigation Groups */}
      <div className="custom-nav-groups">
        {navGroups.map((group, groupIndex) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + groupIndex * 0.05 }}
            className={`custom-nav-group ${expandedGroups.includes(group.label) ? 'expanded' : ''}`}
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.label)}
              className="custom-nav-group-toggle"
            >
              <span className="custom-nav-group-icon">{group.icon}</span>
              <span className="custom-nav-group-label">{group.label}</span>
              <span className="custom-nav-group-arrow">▼</span>
            </button>

            {/* Group Items */}
            <div className="custom-nav-group-items">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`custom-nav-item ${isActive(item.href) ? 'active' : ''}`}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Settings at Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="custom-nav-settings"
      >
        <Link href="/admin/globals/site-settings" className="custom-nav-item">
          <span>⚙️</span>
          <span>Settings</span>
        </Link>
      </motion.div>
    </nav>
  )
}
