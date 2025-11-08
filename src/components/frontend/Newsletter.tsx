'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle2, Loader2 } from 'lucide-react'

interface NewsletterProps {
  settings?: any
}

export default function Newsletter({ settings }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Get settings with defaults
  const newsletterEnabled = settings?.newsletterEnabled !== false
  const newsletterTitle = settings?.newsletterTitle || 'Stay in the Loop'
  const newsletterDescription = settings?.newsletterDescription ||
    'Get the latest tech insights, tutorials, and industry news delivered straight to your inbox. Join 10,000+ developers and tech enthusiasts!'
  const newsletterPrivacyText = settings?.newsletterPrivacyText ||
    'No spam, unsubscribe anytime. We respect your privacy.'

  // Don't render if newsletter is disabled
  if (!newsletterEnabled) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message || 'Successfully subscribed!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 opacity-95"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Mail className="w-5 h-5" />
            Newsletter
          </div>

          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {newsletterTitle}
          </h3>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            {newsletterDescription}
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={loading || status === 'success'}
                className="flex-1 px-6 py-4 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 rounded-xl focus:outline-none focus:border-white focus:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <motion.button
                type="submit"
                disabled={loading || status === 'success'}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition transform shadow-xl whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Subscribing...
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Subscribed!
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </motion.button>
            </div>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                    status === 'success'
                      ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                      : 'bg-red-500/20 text-red-100 border border-red-400/30'
                  }`}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="text-blue-200 text-sm mt-4">
            {newsletterPrivacyText}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
