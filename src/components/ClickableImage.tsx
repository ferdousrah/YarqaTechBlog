// src/components/ClickableImage.tsx - Clickable image with lightbox
'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageLightbox from './ImageLightbox'

interface ClickableImageProps {
  src: string
  alt: string
  caption?: string
  className?: string
  containerClassName?: string
  priority?: boolean
  sizes?: string
}

export default function ClickableImage({
  src,
  alt,
  caption,
  className = 'object-cover transition-transform duration-700 group-hover:scale-110',
  containerClassName = 'relative w-full h-96 rounded-xl overflow-hidden group cursor-pointer',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
}: ClickableImageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <div>
        <div className={containerClassName} onClick={() => setLightboxOpen(true)}>
          <Image src={src} alt={alt} fill className={className} sizes={sizes} priority={priority} />
        </div>

        {/* Caption/Photo Credit */}
        {caption && (
          <p className="text-sm text-gray-500 italic mt-3 text-center">{caption}</p>
        )}
      </div>

      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        src={src}
        alt={alt}
        caption={caption}
      />
    </>
  )
}
