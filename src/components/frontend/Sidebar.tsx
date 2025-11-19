'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface SidebarProps {
  categories: Category[]
  settings: any
}

export default function Sidebar({ categories, settings }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Get logo from settings
  const logo = settings?.logo

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

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gray-900 text-white z-40
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo & Collapse Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              {logo && typeof logo === 'object' && logo.url ? (
                <Image
                  src={logo.url}
                  alt={logo.alt || 'Logo'}
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-xl font-bold text-white">
                  {settings?.siteName || 'Yarqa Tech'}
                </span>
              )}
            </Link>
          )}

          {/* Collapse Toggle - Desktop only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
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

        {/* New Post Button */}
        <div className="p-3">
          <Link
            href="/blog"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              bg-gray-800 hover:bg-gray-700 transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {!isCollapsed && <span className="font-medium">All Posts</span>}
          </Link>
        </div>

        {/* Categories Section */}
        <div className="flex-1 overflow-y-auto">
          <div className={`px-3 py-2 ${isCollapsed ? 'hidden' : ''}`}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Categories
            </h3>
          </div>

          <nav className="px-3 space-y-1">
            {categories.map((category) => {
              const isActive = pathname === `/category/${category.slug}`
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-colors group relative
                    ${isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? category.name : undefined}
                >
                  {/* Category Icon */}
                  <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </span>

                  {/* Category Name */}
                  {!isCollapsed && (
                    <span className="truncate text-sm">{category.name}</span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                      {category.name}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section - Home & Search */}
        <div className="border-t border-gray-800 p-3 space-y-1">
          <Link
            href="/"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-gray-300 hover:bg-gray-800 hover:text-white transition-colors
              ${isCollapsed ? 'justify-center' : ''}
              ${pathname === '/' ? 'bg-gray-800 text-white' : ''}
            `}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {!isCollapsed && <span className="text-sm">Home</span>}
          </Link>

          <Link
            href="/search"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-gray-300 hover:bg-gray-800 hover:text-white transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {!isCollapsed && <span className="text-sm">Search</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}
