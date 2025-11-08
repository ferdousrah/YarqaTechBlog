// src/components/ImageLightbox.tsx - Medium-style image viewer
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageLightboxProps {
  isOpen: boolean
  onClose: () => void
  src: string
  alt: string
  caption?: string
}

export default function ImageLightbox({
  isOpen,
  onClose,
  src,
  alt,
  caption,
}: ImageLightboxProps) {
  const [zoom, setZoom] = useState(1)

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Reset zoom when opening
  useEffect(() => {
    if (isOpen) {
      setZoom(1)
    }
  }, [isOpen])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleDownload = () => {
    // Create a temporary link to download the image
    const link = document.createElement('a')
    link.href = src
    link.download = alt || 'image'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Toolbar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomOut()
              }}
              disabled={zoom <= 0.5}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <span className="text-white text-sm font-medium px-2 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomIn()
              }}
              disabled={zoom >= 3}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-white/30 mx-1" />

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDownload()
              }}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label="Download image"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Image container */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoom})` }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </motion.div>

          {/* Caption */}
          {caption && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-3xl px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm text-center"
            >
              {caption}
            </motion.div>
          )}

          {/* Instructions */}
          <div className="absolute bottom-4 right-4 text-white/60 text-xs">
            Press <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> or click outside to
            close
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
