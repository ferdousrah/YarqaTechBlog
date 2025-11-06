// src/app/(frontend)/blog/[slug]/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import LexicalContent from '@/components/frontend/LexicalContent'
import { Comments } from '@/components/Comments'

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    limit: 1000,
  })

  return posts.docs.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: params.slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  if (!result.docs.length) {
    notFound()
  }

  const post = result.docs[0]

  // Get related posts
  const relatedPosts = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { id: { not_equals: post.id } },
        {
          category: {
            equals: typeof post.category === 'object' ? post.category.id : post.category,
          },
        },
      ],
    },
    limit: 3,
    sort: '-publishedAt',
  })

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-white">
      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={`/category/${typeof post.category === 'object' ? post.category.slug : ''}`}
            className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded uppercase hover:bg-blue-700 transition"
          >
            {typeof post.category === 'object' ? post.category.name : ''}
          </Link>
          <span className="text-gray-500 text-sm">{formattedDate}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">{post.excerpt}</p>

        {/* Author & Meta Info */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {typeof post.author === 'object' ? post.author.name.charAt(0) : 'A'}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {typeof post.author === 'object' ? post.author.name : ''}
              </div>
              <div className="text-sm text-gray-500">
                {post.readTime && `${post.readTime} min read`}
              </div>
            </div>
          </div>

          {/* View Count */}
          <div className="flex items-center gap-6 text-gray-500">
            {post.views > 0 && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span className="text-sm font-medium">{post.views}</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {typeof post.featuredImage === 'object' && post.featuredImage?.url && (
          <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content - Using Lexical Renderer */}
        <LexicalContent content={post.content} />

        {/* Tags */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-12 mb-12 pb-12 border-t border-b border-gray-200">
            {post.tags.map((tag) =>
              typeof tag === 'object' ? (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition"
                >
                  #{tag.name}
                </Link>
              ) : null,
            )}
          </div>
        )}

        {/* Social Share Buttons */}
        <div className="flex items-center gap-4 mb-12">
          <span className="font-semibold text-gray-900">Share this article:</span>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-blue-800 hover:bg-blue-900 text-white rounded-full flex items-center justify-center transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <Comments
          postId={post.id}
          enableComments={post.commentsSettings?.enableComments ?? true}
        />
      </article>

      {/* Related Posts */}
      {relatedPosts.docs.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.docs.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                  <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className="relative h-48 bg-gray-200">
                      {typeof relatedPost.featuredImage === 'object' &&
                      relatedPost.featuredImage?.url ? (
                        <Image
                          src={relatedPost.featuredImage.url}
                          alt={relatedPost.featuredImage.alt || relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                          <span className="text-4xl font-bold text-white">
                            {relatedPost.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-blue-600 font-bold text-xs uppercase mb-2">
                        {typeof relatedPost.category === 'object' ? relatedPost.category.name : ''}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
