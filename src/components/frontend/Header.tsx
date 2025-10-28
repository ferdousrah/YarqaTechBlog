// src/components/frontend/Header.tsx - With functional mobile menu
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold">
              <span className="text-gray-900">Yarqa</span>
              <span className="text-blue-600">Tech</span>
            </Link>
          </div>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition">
              Home
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900 font-medium transition">
              Latest
            </Link>
            <Link
              href="/categories"
              className="text-gray-700 hover:text-gray-900 font-medium transition"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 font-medium transition"
            >
              About
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-sm font-medium">Search</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded transition"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Dropdown */}
      {searchOpen && (
        <div className="border-t border-gray-200 bg-white py-4 shadow-lg">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="px-4 py-3 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Bar - Desktop */}
      <div className="hidden lg:block border-t border-gray-200 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 overflow-x-auto py-2 text-sm">
            <Link
              href="/category/web-development"
              className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition"
            >
              Web Development
            </Link>
            <Link
              href="/category/mobile-apps"
              className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition"
            >
              Mobile Apps
            </Link>
            <Link
              href="/category/ai-machine-learning"
              className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition"
            >
              AI & ML
            </Link>
            <Link
              href="/category/cloud-computing"
              className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition"
            >
              Cloud
            </Link>
            <Link
              href="/category/cybersecurity"
              className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition"
            >
              Security
            </Link>
            <Link
              href="/category/design"
              className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition"
            >
              Design
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobileMenu} />
      )}

      {/* Mobile Menu Slide-out */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <span className="text-2xl font-bold">
              <span className="text-gray-900">Yarqa</span>
              <span className="text-blue-600">Tech</span>
            </span>
            <button onClick={closeMobileMenu} className="p-2 hover:bg-gray-100 rounded transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-6 border-b border-gray-200">
            <form
              onSubmit={(e) => {
                handleSearch(e)
                closeMobileMenu()
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </form>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 overflow-y-auto p-6">
            <div className="space-y-1">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                🏠 Home
              </Link>
              <Link
                href="/blog"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                📰 Latest
              </Link>
              <Link
                href="/categories"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                📁 Categories
              </Link>
              <Link
                href="/tags"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                🏷️ Tags
              </Link>
              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                ℹ️ About
              </Link>
            </div>

            {/* Popular Categories */}
            <div className="mt-8">
              <h3 className="px-4 text-xs font-bold text-gray-500 uppercase mb-3">
                Popular Categories
              </h3>
              <div className="space-y-1">
                <Link
                  href="/category/web-development"
                  onClick={closeMobileMenu}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm transition"
                >
                  💻 Web Development
                </Link>
                <Link
                  href="/category/mobile-apps"
                  onClick={closeMobileMenu}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm transition"
                >
                  📱 Mobile Apps
                </Link>
                <Link
                  href="/category/ai-machine-learning"
                  onClick={closeMobileMenu}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm transition"
                >
                  🤖 AI & ML
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <Link
              href="/search"
              onClick={closeMobileMenu}
              className="block w-full px-4 py-3 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              🔍 Search Articles
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
