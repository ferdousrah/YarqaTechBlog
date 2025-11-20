'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSidebar } from '@/contexts/SidebarContext'
import { useAuth } from '@/contexts/AuthContext'
import LogoutFeedbackModal from './LogoutFeedbackModal'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  children?: Category[]
}

interface SidebarProps {
  categories: Category[]
  settings: any
}

export default function Sidebar({ categories, settings }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { isCollapsed, toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutFeedback = async (rating: string, feedback: string) => {
    // Submit feedback if rating is provided
    if (rating && user) {
      try {
        await fetch('/api/logout-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            rating,
            feedback,
            userEmail: user.email,
            userName: user.name,
          }),
        })
      } catch (error) {
        console.error('Failed to submit logout feedback:', error)
      }
    }

    // Perform logout
    await logout()
    router.push('/')
  }

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Toggle submenu expansion
  const toggleMenu = (categoryId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Check if category or any of its children is active
  const isActiveCategory = (category: Category): boolean => {
    if (pathname === `/category/${category.slug}`) return true
    if (category.children) {
      return category.children.some((child) => pathname === `/category/${child.slug}`)
    }
    return false
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-lg rounded-lg p-2 hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Light Theme */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gray-50 border-r border-gray-200 z-40
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header with Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Categories
            </h2>
          )}

          {/* Collapse Toggle - Desktop only */}
          <button
            onClick={toggleSidebar}
            className={`hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* All Posts Button */}
        <div className="p-3">
          <Link
            href="/blog"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'All Posts' : undefined}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            {!isCollapsed && <span className="font-medium text-sm">All Posts</span>}
          </Link>
        </div>

        {/* Categories Section with Light Scrollbar */}
        <div className="flex-1 overflow-y-auto sidebar-scroll">
          <nav className="px-3 space-y-1 pb-3">
            {categories.map((category) => {
              const hasChildren = category.children && category.children.length > 0
              const isExpanded = expandedMenus.includes(category.id)
              const isActive = isActiveCategory(category)

              return (
                <div key={category.id}>
                  {/* Parent Category */}
                  {hasChildren ? (
                    // Category with children - click to expand/collapse
                    <div
                      onClick={() => toggleMenu(category.id)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-colors group relative cursor-pointer
                        ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      {/* Category Icon */}
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                          />
                        </svg>
                      </span>

                      {/* Category Name */}
                      {!isCollapsed && <span className="truncate text-sm flex-1">{category.name}</span>}

                      {/* Expand/Collapse Chevron */}
                      {!isCollapsed && (
                        <svg
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                          {category.name}
                          {` (${category.children?.length})`}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Category without children - click to navigate
                    <Link
                      href={`/category/${category.slug}`}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-colors group relative
                        ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      title={isCollapsed ? category.name : undefined}
                    >
                      {/* Category Icon */}
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                          />
                        </svg>
                      </span>

                      {/* Category Name */}
                      {!isCollapsed && <span className="truncate text-sm">{category.name}</span>}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                          {category.name}
                        </div>
                      )}
                    </Link>
                  )}

                  {/* Sub-categories with smooth animation */}
                  {hasChildren && !isCollapsed && (
                    <div
                      className={`
                        ml-4 border-l-2 border-gray-200 pl-3 overflow-hidden
                        transition-all duration-300 ease-in-out
                        ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                      `}
                    >
                      <div className="space-y-1 py-1">
                        {/* View all link for parent category */}
                        <Link
                          href={`/category/${category.slug}`}
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                            transition-colors text-blue-600 hover:bg-blue-50 hover:text-blue-700
                          `}
                        >
                          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                              />
                            </svg>
                          </span>
                          <span className="truncate">View all {category.name}</span>
                        </Link>
                        {category.children?.map((child) => {
                          const isChildActive = pathname === `/category/${child.slug}`
                          return (
                            <Link
                              key={child.id}
                              href={`/category/${child.slug}`}
                              className={`
                                flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                                transition-colors
                                ${isChildActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}
                              `}
                            >
                              <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                  />
                                </svg>
                              </span>
                              <span className="truncate">{child.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section - Auth */}
        <div className="border-t border-gray-200 p-3 space-y-1">
          {user ? (
            <>
              {/* User Info */}
              {!isCollapsed && (
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              )}

              {/* My Interests */}
              <Link
                href="/settings/interests"
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? 'My Interests' : undefined}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                {!isCollapsed && <span className="text-sm">My Interests</span>}
              </Link>

              {/* Account Settings */}
              <Link
                href="/settings/account"
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? 'Account Settings' : undefined}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {!isCollapsed && <span className="text-sm">Account</span>}
              </Link>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? 'Sign Out' : undefined}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {!isCollapsed && <span className="text-sm">Sign Out</span>}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? 'Sign In' : undefined}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                {!isCollapsed && <span className="text-sm">Sign In</span>}
              </Link>

              <Link
                href="/register"
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? 'Sign Up' : undefined}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                {!isCollapsed && <span className="text-sm font-medium">Sign Up</span>}
              </Link>
            </>
          )}
        </div>
      </aside>

      {/* Light Scrollbar Styles */}
      <style jsx global>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f1f1f1;
        }
      `}</style>

      {/* Logout Feedback Modal */}
      {user && (
        <LogoutFeedbackModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onSubmit={handleLogoutFeedback}
          userEmail={user.email || ''}
          userName={user.name || ''}
        />
      )}
    </>
  )
}
