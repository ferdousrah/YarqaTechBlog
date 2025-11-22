'use client'

import Link from 'next/link'
import Image from 'next/image'
import BookmarkButton from './BookmarkButton'

interface ArticleCardProps {
  post: any
  variant?: 'list' | 'card'
  borderColor?: string
}

export function ArticleCardWithBookmark({ post, variant = 'list', borderColor }: ArticleCardProps) {
  if (variant === 'list') {
    return (
      <div className="group relative">
        <Link
          href={`/blog/${post.slug}`}
          className="flex gap-5 pb-6 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gradient-to-r hover:from-blue-50/50 dark:hover:from-blue-900/20 hover:to-transparent transition-all duration-300 p-4 -m-4 rounded-xl"
        >
          {/* Image */}
          <div className="relative w-40 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 shadow-md">
            {typeof post.featuredImage === 'object' && post.featuredImage?.url ? (
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                <span className="text-4xl font-bold text-blue-600">{post.title.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-wide">
                {typeof post.category === 'object' ? post.category.name : ''}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2 leading-tight">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">{post.excerpt}</p>
          </div>
        </Link>

        {/* Bookmark Button - Appears on hover */}
        <div
          className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <BookmarkButton postId={post.id} variant="icon-only" showLabel={false} />
        </div>
      </div>
    )
  }

  // Card variant for category sections
  return (
    <div className="group relative">
      <Link href={`/blog/${post.slug}`}>
        <article className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full border border-gray-100 dark:border-gray-700">
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {typeof post.featuredImage === 'object' && post.featuredImage?.url ? (
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                <span className="text-6xl font-bold text-blue-600">{post.title.charAt(0)}</span>
              </div>
            )}

            {/* Bookmark Button - Appears on hover */}
            <div
              className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <BookmarkButton postId={post.id} variant="icon-only" showLabel={false} />
            </div>
          </div>
          <div className="p-6">
            <div
              className="text-xs font-bold mb-3 uppercase tracking-wide"
              style={{ color: borderColor }}
            >
              {typeof post.category === 'object' ? post.category.name : ''}
            </div>
            <h3 className="font-bold text-2xl text-gray-900 dark:text-white group-hover:opacity-80 transition mb-3 line-clamp-2 leading-tight">
              {post.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">{post.excerpt}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {typeof post.author === 'object' ? post.author.name.charAt(0) : 'A'}
                </div>
                <span>{typeof post.author === 'object' ? post.author.name : ''}</span>
              </div>
              <span>•</span>
              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </article>
      </Link>
    </div>
  )
}
