// src/components/AnimatedComponents.tsx - Reusable animated components
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'
import BookmarkButton from './BookmarkButton'

// Animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4 },
}

// Animated Hero Post Card
interface HeroPostCardProps {
  post: any
  index?: number
}

export function AnimatedHeroPost({ post, index = 0 }: HeroPostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="lg:col-span-2"
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <motion.article
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="relative h-[600px] rounded-2xl overflow-hidden bg-gray-900 shadow-2xl"
        >
          {/* Featured Image */}
          {typeof post.featuredImage === 'object' && post.featuredImage?.url && (
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          )}

          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

          {/* Bookmark Button - Top Right (visible on hover) */}
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
            <BookmarkButton postId={post.id} variant="icon-only" />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg">
                {typeof post.category === 'object' ? post.category.name : ''}
              </span>
              <span className="text-gray-200 text-sm font-medium">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight group-hover:text-blue-300 transition-colors duration-300"
            >
              {post.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-100 mb-5 line-clamp-2 leading-relaxed"
            >
              {post.excerpt}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 text-sm"
            >
              <div className="flex items-center gap-2">
                {typeof post.author === 'object' && post.author.avatar && typeof post.author.avatar === 'object' && post.author.avatar.url ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden relative">
                    <Image
                      src={post.author.avatar.url}
                      alt={post.author.avatar.alt || post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {typeof post.author === 'object' ? post.author.name.charAt(0) : 'A'}
                  </div>
                )}
                <span className="font-medium">
                  {typeof post.author === 'object' ? post.author.name : ''}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  )
}

// Animated Small Post Card
export function AnimatedSmallPost({ post, index = 0 }: HeroPostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <motion.article
          whileHover={{ scale: 1.03, y: -5 }}
          transition={{ duration: 0.3 }}
          className="relative h-[140px] rounded-xl overflow-hidden bg-gray-900 shadow-lg"
        >
          {/* Featured Image */}
          {typeof post.featuredImage === 'object' && post.featuredImage?.url && (
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

          {/* Bookmark Button - Top Right (visible on hover) */}
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
            <BookmarkButton postId={post.id} variant="icon-only" showLabel={false} />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="text-xs font-bold mb-2 text-blue-300 uppercase tracking-wide">
              {typeof post.category === 'object' ? post.category.name : ''}
            </div>
            <h3 className="font-bold text-sm line-clamp-2 group-hover:text-blue-200 transition-colors leading-snug">
              {post.title}
            </h3>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  )
}

// Animated Post Card
export function AnimatedPostCard({ post, index = 0 }: HeroPostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`} className="group">
        <motion.article
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl h-full border border-gray-100"
        >
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {typeof post.featuredImage === 'object' && post.featuredImage?.url ? (
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                <span className="text-5xl font-bold text-blue-600">{post.title.charAt(0)}</span>
              </div>
            )}
            {index !== undefined && (
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                #{index + 1}
              </div>
            )}
            {/* Bookmark Button - Top Right (visible on hover) */}
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
              <BookmarkButton postId={post.id} variant="icon-only" showLabel={false} />
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-wide">
                {typeof post.category === 'object' ? post.category.name : ''}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 text-xs">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-tight">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{post.excerpt}</p>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  )
}

// Animated Section Header
interface SectionHeaderProps {
  title: string
  link?: { href: string; label: string }
}

export function AnimatedSectionHeader({ title, link }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
        />
      </div>
      {link && (
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <Link
            href={link.href}
            className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition flex items-center gap-2 group"
          >
            {link.label}
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}

// Animated Container
interface AnimatedContainerProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedContainer({ children, className = '', delay = 0 }: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
