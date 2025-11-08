// src/components/ThemeDebugger.tsx - Debug component for theme testing
'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { RefreshCw, X, Eye } from 'lucide-react'

export default function ThemeDebugger() {
  const { theme, loading, refreshTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshTheme()
    setIsRefreshing(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all"
        title="Open Theme Debugger"
      >
        <Eye className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px] overflow-auto bg-white border-2 border-gray-300 rounded-lg shadow-2xl">
      <div className="sticky top-0 bg-gray-800 text-white p-3 flex items-center justify-between">
        <h3 className="font-bold text-sm">Theme Debugger</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1 hover:bg-gray-700 rounded transition disabled:opacity-50"
            title="Refresh Theme"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-700 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading theme...</div>
        ) : !theme ? (
          <div className="text-center py-4 text-red-500">
            Failed to load theme
          </div>
        ) : (
          <>
            {/* Colors */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-gray-700">
                Colors
              </h4>
              <div className="space-y-1 text-xs">
                {Object.entries(theme.colors).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: value }}
                    />
                    <span className="text-gray-600 flex-1">{key}:</span>
                    <span className="font-mono text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-gray-700">
                Typography
              </h4>
              <div className="space-y-1 text-xs">
                {Object.entries(theme.typography).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-mono text-gray-800">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spacing */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-gray-700">
                Spacing & Layout
              </h4>
              <div className="space-y-1 text-xs">
                {Object.entries(theme.spacing).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-mono text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-gray-700">
                Buttons
              </h4>
              <div className="space-y-1 text-xs">
                {Object.entries(theme.buttons).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-mono text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Animations */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-gray-700">
                Animations
              </h4>
              <div className="space-y-1 text-xs">
                {Object.entries(theme.animations).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-mono text-gray-800">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Button */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-gray-700">
                Theme Preview
              </h4>
              <button
                className="w-full py-2 px-4 rounded text-white font-semibold"
                style={{
                  background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                  borderRadius: 'var(--button-radius)',
                  fontFamily: 'var(--font-family)',
                }}
              >
                Test Button (Primary Gradient)
              </button>
            </div>

            <div className="text-xs text-gray-500 pt-2 border-t">
              <p>
                <strong>Tip:</strong> After changing theme in admin, click the
                refresh button ↻ above or hard refresh the page (Ctrl/Cmd +
                Shift + R)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
