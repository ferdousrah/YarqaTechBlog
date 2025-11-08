// src/components/ContentImage.tsx - Content image with lightbox for blog content
'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageLightbox from './ImageLightbox'

interface ContentImageProps {
  src: string
  alt: string
  caption?: string
}

export function ContentImage({ src, alt, caption }: ContentImageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <figure className="my-8">
        <div
          className="relative w-full h-96 rounded-xl overflow-hidden group cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-gray-600 italic">
            {caption}
          </figcaption>
        )}
      </figure>

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
