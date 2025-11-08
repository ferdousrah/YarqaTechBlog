// src/components/frontend/Header.tsx - Modern design with Framer Motion
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, Home, BookOpen, Folder, Info, User, LogIn, UserPlus, Mail, Bookmark } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// Helper function to get icon component from string
function getIconComponent(iconName?: string) {
  const icons: Record<string, any> = {
    home: Home,
    book: BookOpen,
    folder: Folder,
    info: Info,
    mail: Mail,
    user: User,
  }
  return icons[iconName || 'home'] || Home
}

interface HeaderProps {
  settings?: any
}

export default function Header({ settings }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userAvatar, setUserAvatar] = useState<{ url: string; alt?: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  // Fetch user avatar when authenticated
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (user) {
        try {
          const response = await fetch('/api/user/profile')
          const data = await response.json()
          if (data.success && data.user?.avatar) {
            setUserAvatar(data.user.avatar)
          } else {
            setUserAvatar(null)
          }
        } catch (error) {
          console.error('Failed to fetch user avatar:', error)
          setUserAvatar(null)
        }
      } else {
        setUserAvatar(null)
      }
    }
    fetchUserAvatar()
  }, [user])

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

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
    router.push('/')
  }

  // Use custom nav links from settings or default ones
  const navItems = settings?.navigationLinks?.length
    ? settings.navigationLinks.map((link: any) => ({
        href: link.href,
        label: link.label,
        icon: getIconComponent(link.icon),
      }))
    : [
        { href: '/', label: 'Home', icon: Home },
        { href: '/blog', label: 'Latest', icon: BookOpen },
        { href: '/categories', label: 'Categories', icon: Folder },
        { href: '/about', label: 'About', icon: Info },
      ]

  // Get logo text from settings or use defaults
  const logoText = {
    first: settings?.logoText?.firstPart || 'Yarqa',
    second: settings?.logoText?.secondPart || 'Tech',
    letter: settings?.logoText?.logoLetter || 'Y',
  }

  const showAuthButtons = settings?.showAuthButtons !== false
  const showSearch = settings?.showSearch !== false
  const authButtonStyle = settings?.authButtonStyle || 'both'

  // Check if there's an uploaded logo
  const hasUploadedLogo = settings?.logo && typeof settings.logo === 'object' && settings.logo?.url
  const logoUrl = hasUploadedLogo ? settings.logo.url : null

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200'
          : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with animation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center"
          >
            <Link href="/" className="group flex items-center gap-2">
              {logoUrl ? (
                // Uploaded logo image
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative h-10 w-auto"
                >
                  <Image
                    src={logoUrl}
                    alt={settings?.siteName || 'Logo'}
                    height={40}
                    width={120}
                    className="h-10 w-auto object-contain"
                    priority
                  />
                </motion.div>
              ) : (
                // Default text-based logo
                <>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <span className="text-white font-bold text-xl">{logoText.letter}</span>
                  </motion.div>
                  <span className="text-2xl md:text-3xl font-bold">
                    <span className="gradient-text">{logoText.first}</span>
                    <span className="text-gray-900">{logoText.second}</span>
                  </span>
                </>
              )}
            </Link>
          </motion.div>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Right Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            {/* Search Button */}
            {showSearch && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
                <span className="text-sm font-medium">Search</span>
              </motion.button>
            )}

            {/* Auth Buttons / User Menu */}
            {showAuthButtons && (
              <div className="hidden lg:flex items-center gap-2">
                {user ? (
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300"
                    >
                      {userAvatar?.url ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden relative">
                          <Image
                            src={userAvatar.url}
                            alt={userAvatar.alt || user.name || 'Profile photo'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium">{user.name}</span>
                    </motion.button>

                    {/* User Dropdown */}
                    <AnimatePresence>
                      {showUserMenu && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-30"
                            onClick={() => setShowUserMenu(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-40"
                          >
                            <div className="px-4 py-3 border-b border-gray-100">
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <Link
                              href="/account"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              <User className="w-4 h-4" />
                              My Account
                            </Link>
                            <Link
                              href="/bookmarks"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              <Bookmark className="w-4 h-4" />
                              My Bookmarks
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                            >
                              <LogIn className="w-4 h-4 rotate-180" />
                              Sign Out
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    {authButtonStyle === 'dropdown' ? (
                      // Dropdown style - compact account button
                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowUserMenu(!showUserMenu)}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300"
                        >
                          <User className="w-5 h-5" />
                          <span className="text-sm font-medium">Account</span>
                        </motion.button>

                        {/* Account Dropdown */}
                        <AnimatePresence>
                          {showUserMenu && (
                            <>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-30"
                                onClick={() => setShowUserMenu(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-40"
                              >
                                <Link
                                  href="/login"
                                  onClick={() => setShowUserMenu(false)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                >
                                  <LogIn className="w-4 h-4" />
                                  Login
                                </Link>
                                <Link
                                  href="/register"
                                  onClick={() => setShowUserMenu(false)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                >
                                  <UserPlus className="w-4 h-4" />
                                  Register
                                </Link>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : authButtonStyle === 'login' ? (
                      // Login only
                      <Link href="/login">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <LogIn className="w-4 h-4" />
                          <span className="text-sm font-medium">Login</span>
                        </motion.button>
                      </Link>
                    ) : (
                      // Both buttons (default)
                      <>
                        <Link href="/login">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300"
                          >
                            <LogIn className="w-4 h-4" />
                            <span className="text-sm font-medium">Login</span>
                          </motion.button>
                        </Link>
                        <Link href="/register">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span className="text-sm font-medium">Register</span>
                          </motion.button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Search Dropdown with Animation */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 bg-white overflow-hidden"
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form onSubmit={handleSearch} className="flex gap-3">
                <motion.input
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 transition-all duration-300 shadow-sm"
                  autoFocus
                />
                <motion.button
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Search
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-4 py-3 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Bar - Desktop with gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden lg:block border-t border-gray-200 bg-gradient-to-r from-gray-50 via-blue-50/30 to-gray-50"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 overflow-x-auto py-3 text-sm">
            {[
              'Web Development',
              'Mobile Apps',
              'AI & ML',
              'Cloud',
              'Security',
              'Design',
            ].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Link
                  href={`/category/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}
                  className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition-all duration-300 px-3 py-1 rounded-lg hover:bg-white"
                >
                  {category}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay with animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Slide-out with Framer Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"
              >
                {logoUrl ? (
                  // Uploaded logo
                  <div className="relative h-8 w-auto">
                    <Image
                      src={logoUrl}
                      alt={settings?.siteName || 'Logo'}
                      height={32}
                      width={96}
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                ) : (
                  // Default text logo
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{logoText.letter}</span>
                    </div>
                    <span className="text-xl font-bold">
                      <span className="gradient-text">{logoText.first}</span>
                      <span className="text-gray-900">{logoText.second}</span>
                    </span>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeMobileMenu}
                  className="p-2 hover:bg-white rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </motion.div>

              {/* Mobile Search */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 border-b border-gray-200"
              >
                <form
                  onSubmit={(e) => {
                    handleSearch(e)
                    closeMobileMenu()
                  }}
                >
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 transition-all duration-300"
                    />
                  </div>
                </form>
              </motion.div>

              {/* Mobile Navigation */}
              <nav className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 px-4 py-3 text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl font-medium transition-all duration-300"
                        >
                          <Icon className="w-5 h-5 text-blue-600" />
                          {item.label}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Popular Categories */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <h3 className="px-4 text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">
                    Popular Categories
                  </h3>
                  <div className="space-y-1">
                    {[
                      { name: 'Web Development', icon: '💻' },
                      { name: 'Mobile Apps', icon: '📱' },
                      { name: 'AI & ML', icon: '🤖' },
                      { name: 'Cloud', icon: '☁️' },
                    ].map((cat, index) => (
                      <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        <Link
                          href={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm transition-all duration-300"
                        >
                          <span>{cat.icon}</span>
                          {cat.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </nav>

              {/* Mobile Menu Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeMobileMenu}
                  className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Search className="w-5 h-5" />
                    Search Articles
                  </div>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
