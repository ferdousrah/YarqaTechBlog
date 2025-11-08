'use client'

import Link from 'next/link'
import { Home, Search, ArrowLeft, FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-2xl shadow-blue-500/50 mb-6">
            <FileQuestion className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off into the digital void.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-bold border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            <Search className="w-5 h-5" />
            Browse Articles
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">What can you do?</h3>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Check the URL for typos or errors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Use the navigation menu to find what you're looking for</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Return to the homepage and start fresh</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Browse our latest articles and trending posts</span>
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to previous page
        </button>
      </div>
    </div>
  )
}
