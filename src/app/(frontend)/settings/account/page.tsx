'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trash2, Loader2, AlertTriangle, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const deletionReasons = [
  { value: 'not_relevant', label: 'Not finding relevant content' },
  { value: 'too_many_emails', label: 'Too many emails/notifications' },
  { value: 'privacy', label: 'Privacy concerns' },
  { value: 'better_alternative', label: 'Found a better alternative' },
  { value: 'technical_issues', label: 'Technical issues' },
  { value: 'not_using', label: 'Not using the platform anymore' },
  { value: 'other', label: 'Other' },
]

export default function AccountSettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading, logout } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteStep, setDeleteStep] = useState<'survey' | 'confirm'>('survey')
  const [selectedReason, setSelectedReason] = useState('')
  const [feedback, setFeedback] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE' || !user?.id) return

    setDeleting(true)
    try {
      // Submit feedback if provided
      if (selectedReason) {
        await fetch('/api/deletion-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            reason: selectedReason,
            feedback: feedback,
            userEmail: user?.email,
            userName: user?.name,
          }),
        })
      }

      // Delete the user account
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        await logout()
        router.push('/')
      } else {
        alert('Failed to delete account. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const handleSkipSurvey = () => {
    setDeleteStep('confirm')
  }

  const handleSubmitSurvey = () => {
    setDeleteStep('confirm')
  }

  const resetModal = () => {
    setShowDeleteModal(false)
    setDeleteStep('survey')
    setSelectedReason('')
    setFeedback('')
    setConfirmText('')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Settings
            </Link>

            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account</p>
          </div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Role</span>
                <span className="font-medium text-gray-900 capitalize">{user.role}</span>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border-2 border-red-100"
          >
            <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete My Account
            </button>
          </motion.div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {deleteStep === 'survey' ? (
                <>
                  {/* Survey Step */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">We're sorry to see you go</h2>
                        <p className="text-gray-600 mt-1 text-sm">Help us improve by sharing your feedback</p>
                      </div>
                      <button
                        onClick={resetModal}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 max-h-[50vh] overflow-y-auto">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Why are you leaving? (Optional)
                    </p>
                    <div className="space-y-2">
                      {deletionReasons.map((reason) => (
                        <label
                          key={reason.value}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${selectedReason === reason.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="reason"
                            value={reason.value}
                            checked={selectedReason === reason.value}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{reason.label}</span>
                        </label>
                      ))}
                    </div>

                    {selectedReason && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional feedback (Optional)
                        </label>
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Tell us more about your experience..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
                        />
                      </motion.div>
                    )}
                  </div>

                  <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between">
                    <button
                      onClick={handleSkipSurvey}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm"
                    >
                      Skip
                    </button>
                    <button
                      onClick={handleSubmitSurvey}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Confirm Step */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
                          <p className="text-gray-600 text-sm">This action cannot be undone</p>
                        </div>
                      </div>
                      <button
                        onClick={resetModal}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      To confirm, please type <span className="font-bold text-red-600">DELETE</span> below:
                    </p>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>

                  <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between">
                    <button
                      onClick={() => setDeleteStep('survey')}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={confirmText !== 'DELETE' || deleting}
                      className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete My Account'
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
