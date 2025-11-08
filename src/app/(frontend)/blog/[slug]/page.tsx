// src/app/(frontend)/blog/[slug]/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import LexicalContent from '@/components/frontend/LexicalContent'
import { Comments } from '@/components/Comments'
import BookmarkButtonWrapper from '@/components/BookmarkButtonWrapper'
import ClickableImage from '@/components/ClickableImage'
import ShareButtons from '@/components/ShareButtons'
import LikeDislike from '@/components/LikeDislike'
import { headers } from 'next/headers'

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
    depth: 2, // Populate author.avatar and other nested relationships
  })

  if (!result.docs.length) {
    notFound()
  }

  const post = result.docs[0]

  // Get the full URL for sharing
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const fullUrl = `${protocol}://${host}/blog/${post.slug}`

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {typeof post.author === 'object' && post.author.avatar && typeof post.author.avatar === 'object' && post.author.avatar.url ? (
              <div className="w-12 h-12 rounded-full overflow-hidden relative">
                <Image
                  src={post.author.avatar.url}
                  alt={post.author.avatar.alt || post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {typeof post.author === 'object' ? post.author.name.charAt(0) : 'A'}
                </span>
              </div>
            )}
            <div>
              <div className="font-semibold text-gray-900">
                {typeof post.author === 'object' ? post.author.name : ''}
              </div>
              <div className="text-sm text-gray-500">
                {post.readTime && `${post.readTime} min read`}
                {post.views > 0 && post.readTime && ' • '}
                {post.views > 0 && `${post.views} views`}
              </div>
            </div>
          </div>

          {/* Bookmark Button - Right aligned, icon only */}
          <BookmarkButtonWrapper postId={post.id} variant="icon-only" />
        </div>

        {/* Featured Image */}
        {typeof post.featuredImage === 'object' && post.featuredImage?.url && (
          <div className="mb-12">
            <ClickableImage
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              caption={post.featuredImage.caption}
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
        <ShareButtons title={post.title} url={fullUrl} />

        {/* Like/Dislike Buttons */}
        <div className="mb-12">
          <LikeDislike
            postId={post.id}
            initialLikes={post.likes || 0}
            initialDislikes={post.dislikes || 0}
          />
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
