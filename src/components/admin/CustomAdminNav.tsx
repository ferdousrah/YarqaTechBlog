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
    <nav className="custom-admin-nav">
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="nav-logo-section"
      >
        <Link href="/admin" className="nav-logo-link">
          <div className="nav-logo">
            <span className="nav-logo-icon">🚀</span>
            <span className="nav-logo-text">Yarqa Tech</span>
          </div>
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
          className={`nav-dashboard-link ${isActive('/admin') ? 'active' : ''}`}
        >
          <span className="nav-item-icon">📊</span>
          <span>Dashboard</span>
        </Link>
      </motion.div>

      {/* Navigation Groups */}
      <div className="nav-groups">
        {navGroups.map((group, groupIndex) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + groupIndex * 0.05 }}
            className="nav-group"
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.label)}
              className="nav-group-toggle"
            >
              <span className="nav-group-icon">{group.icon}</span>
              <span className="nav-group-label">{group.label}</span>
              <motion.span
                className="nav-group-arrow"
                animate={{ rotate: expandedGroups.includes(group.label) ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.span>
            </button>

            {/* Group Items */}
            <AnimatePresence>
              {expandedGroups.includes(group.label) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="nav-group-items"
                >
                  {group.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.03 }}
                    >
                      <Link
                        href={item.href}
                        className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                      >
                        <span className="nav-item-label">{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Settings at Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="nav-settings"
      >
        <Link href="/admin/globals/site-settings" className="nav-item">
          <span className="nav-item-icon">⚙️</span>
          <span>Settings</span>
        </Link>
      </motion.div>

      <style jsx>{`
        .custom-admin-nav {
          width: 280px;
          height: 100vh;
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
          border-right: 1px solid rgba(148, 163, 184, 0.1);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
        }

        /* Logo Section */
        .nav-logo-section {
          padding: 1.5rem 1rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .nav-logo-link {
          text-decoration: none;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .nav-logo:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .nav-logo-icon {
          font-size: 1.5rem;
        }

        .nav-logo-text {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
        }

        /* Dashboard Link */
        .nav-dashboard-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          margin: 1rem 1rem 0.5rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .nav-dashboard-link:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.5);
        }

        .nav-item-icon {
          font-size: 1.2rem;
        }

        /* Navigation Groups */
        .nav-groups {
          flex: 1;
          padding: 0.5rem 0;
          overflow-y: auto;
        }

        .nav-group {
          margin: 0.5rem 0;
        }

        .nav-group-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.875rem 1.25rem;
          margin: 0.25rem 1rem;
          background: rgba(148, 163, 184, 0.1);
          border: none;
          border-left: 4px solid #3b82f6;
          border-radius: 8px;
          color: #e2e8f0;
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-group-toggle:hover {
          background: rgba(59, 130, 246, 0.2);
          transform: translateX(3px);
        }

        .nav-group-icon {
          font-size: 1rem;
        }

        .nav-group-label {
          flex: 1;
          text-align: left;
        }

        .nav-group-arrow {
          font-size: 0.7rem;
          color: #3b82f6;
        }

        .nav-group-items {
          overflow: hidden;
          padding-left: 1rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          margin: 0.25rem 1rem;
          color: #cbd5e1;
          text-decoration: none;
          border-radius: 8px;
          border-left: 3px solid transparent;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          background: linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
          border-left-color: #3b82f6;
          color: #f1f5f9;
          transform: translateX(3px);
        }

        .nav-item.active {
          background: linear-gradient(to right, #3b82f6, #2563eb);
          border-left-color: #1e40af;
          color: white;
          font-weight: 600;
        }

        .nav-item.active:hover {
          background: linear-gradient(to right, #2563eb, #1d4ed8);
        }

        .nav-item-label {
          flex: 1;
        }

        /* Settings at Bottom */
        .nav-settings {
          padding: 1rem;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
        }

        /* Scrollbar */
        .custom-admin-nav::-webkit-scrollbar {
          width: 6px;
        }

        .custom-admin-nav::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }

        .custom-admin-nav::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 3px;
        }

        .custom-admin-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </nav>
  )
}
