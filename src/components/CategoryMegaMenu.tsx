// src/components/CategoryMegaMenu.tsx - TechCrunch-style mega menu for all categories
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Grid3x3 } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  parent?: number
  subcategories?: Category[]
}

interface CategoryMegaMenuProps {
  isOpen: boolean
  onClose: () => void
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

                {/* Categories List */}
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-24"></div>
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-28"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="space-y-3"
                      >
                        {/* Parent Category */}
                        <Link
                          href={`/category/${category.slug}`}
                          onClick={onClose}
                          className="block text-gray-900 hover:text-blue-600 font-bold text-base transition-colors"
                        >
                          {category.name}
                        </Link>

                        {/* Subcategories */}
                        {category.subcategories && category.subcategories.length > 0 && (
                          <ul className="space-y-2 pl-0">
                            {category.subcategories.map((subcat) => (
                              <li key={subcat.id}>
                                <Link
                                  href={`/category/${subcat.slug}`}
                                  onClick={onClose}
                                  className="block text-gray-600 hover:text-blue-600 text-sm transition-colors"
                                >
                                  {subcat.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!loading && categories.length === 0 && (
                  <div className="text-center py-12">
                    <Grid3x3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No categories available yet</p>
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
