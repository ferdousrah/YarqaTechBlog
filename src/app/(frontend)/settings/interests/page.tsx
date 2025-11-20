'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, CheckCircle2, Save, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Category {
  id: string
  name: string
  slug: string
  color?: string
  icon?: string
}

export default function InterestsSettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Fetch categories and user's current interests
  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      // Fetch all parent categories
      const categoriesResponse = await fetch('/api/categories?limit=50&where[parent][exists]=false')
      const categoriesData = await categoriesResponse.json()
      if (categoriesData.docs) {
        setCategories(categoriesData.docs)
      }

      // Fetch user's current interests
      const userResponse = await fetch('/api/users/me', {
        credentials: 'include',
      })
      if (userResponse.ok) {
        const userData = await userResponse.json()
        const interests = userData.user?.interestedCategories || []
        const interestIds = interests.map((cat: any) =>
          typeof cat === 'object' ? cat.id : cat
        )
        setSelectedCategories(interestIds)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSaved(false)
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSave = async () => {
    if (!user?.id) return

    setSaving(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          interestedCategories: selectedCategories,
        }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setSaving(false)
    }
  }

  const getCategoryIcon = (icon?: string) => {
    const icons: Record<string, string> = {
      code: '💻',
      mobile: '📱',
      cloud: '☁️',
      database: '🗄️',
      security: '🔒',
      ai: '🤖',
      design: '🎨',
      business: '💼',
      tutorial: '📚',
      news: '📰',
    }
    return icons[icon || 'code'] || '📝'
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Interests</h1>
              <p className="text-gray-600 dark:text-gray-400">Select topics to personalize your feed</p>
            </div>
          </div>
        </div>

        {/* Categories Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id)
              return (
                <motion.button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                    flex items-center gap-2 border-2
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <span className="text-lg">{getCategoryIcon(category.icon)}</span>
                  {category.name}
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  )}
                </motion.button>
              )
            })}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No categories available</p>
            </div>
          )}
        </motion.div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedCategories.length > 0
              ? `${selectedCategories.length} topic${selectedCategories.length > 1 ? 's' : ''} selected`
              : 'No topics selected'}
          </p>

          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.98 }}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-300
              flex items-center gap-2
              ${saved
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
              }
              disabled:opacity-50
            `}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Preferences
              </>
            )}
          </motion.button>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800"
        >
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">How it works</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Select categories you're interested in</li>
            <li>• Your home page will show a "For You" section with personalized content</li>
            <li>• You can update your interests anytime</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
