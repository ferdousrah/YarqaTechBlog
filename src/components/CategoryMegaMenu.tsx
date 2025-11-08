// src/components/CategoryMegaMenu.tsx - TechCrunch-style mega menu for all categories
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Grid3x3, Code, Smartphone, Cloud, Database, Shield, Palette, Briefcase, BookOpen, Newspaper, Brain } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  postCount?: number
  parent?: number
  subcategories?: Category[]
}

interface CategoryMegaMenuProps {
  isOpen: boolean
  onClose: () => void
}

// Icon mapping
const iconMap: Record<string, any> = {
  code: Code,
  mobile: Smartphone,
  cloud: Cloud,
  database: Database,
  security: Shield,
  design: Palette,
  business: Briefcase,
  tutorial: BookOpen,
  news: Newspaper,
  ai: Brain,
}

export default function CategoryMegaMenu({ isOpen, onClose }: CategoryMegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()

        if (data.success) {
          // Organize categories with their subcategories
          const categoryMap = new Map<number, Category>()
          const rootCategories: Category[] = []

          // First pass: create map of all categories
          data.categories.forEach((cat: Category) => {
            categoryMap.set(cat.id, { ...cat, subcategories: [] })
          })

          // Second pass: organize hierarchy
          data.categories.forEach((cat: Category) => {
            const category = categoryMap.get(cat.id)!
            if (cat.parent && typeof cat.parent === 'number') {
              const parent = categoryMap.get(cat.parent)
              if (parent) {
                parent.subcategories!.push(category)
              }
            } else {
              rootCategories.push(category)
            }
          })

          setCategories(rootCategories)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const getIcon = (iconName?: string) => {
    const IconComponent = iconMap[iconName || 'code'] || Code
    return IconComponent
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Mega Menu Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-white shadow-2xl border-b border-gray-200">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
                    <p className="text-gray-600 mt-1">Explore all topics and find what interests you</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Categories Grid */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category, index) => {
                      const Icon = getIcon(category.icon)
                      const bgColor = category.color || '#3B82F6'

                      return (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={`/category/${category.slug}`}
                            onClick={onClose}
                            className="block group"
                          >
                            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
                              {/* Icon and Title */}
                              <div className="flex items-start gap-4 mb-3">
                                <div
                                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                                  style={{ backgroundColor: bgColor }}
                                >
                                  <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition">
                                    {category.name}
                                  </h3>
                                  {category.postCount !== undefined && category.postCount > 0 && (
                                    <p className="text-sm text-gray-500">
                                      {category.postCount} {category.postCount === 1 ? 'article' : 'articles'}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Description */}
                              {category.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {category.description}
                                </p>
                              )}

                              {/* Subcategories */}
                              {category.subcategories && category.subcategories.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <p className="text-xs font-semibold text-gray-500 mb-2">Subcategories:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {category.subcategories.slice(0, 3).map((subcat) => (
                                      <span
                                        key={subcat.id}
                                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                                      >
                                        {subcat.name}
                                      </span>
                                    ))}
                                    {category.subcategories.length > 3 && (
                                      <span className="text-xs text-gray-500">
                                        +{category.subcategories.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                )}

                {/* Empty State */}
                {!loading && categories.length === 0 && (
                  <div className="text-center py-12">
                    <Grid3x3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No categories available yet</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
