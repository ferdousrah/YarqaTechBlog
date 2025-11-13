// src/app/(frontend)/[slug]/page.tsx - Dynamic page route
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import LexicalContent from '@/components/frontend/LexicalContent'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: params.slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  if (!result.docs.length) {
    return {
      title: 'Page Not Found',
    }
  }

  const page = result.docs[0]

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || page.excerpt,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    where: {
      status: { equals: 'published' },
    },
    limit: 1000,
  })

  return pages.docs.map((page) => ({
    slug: page.slug,
  }))
}

export default async function Page({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: params.slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })

  if (!result.docs.length) {
    notFound()
  }

  const page = result.docs[0]

  return (
    <div className="bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {page.title}
          </h1>

          {page.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed">{page.excerpt}</p>
          )}
        </header>

        {/* Featured Image */}
        {typeof page.featuredImage === 'object' && page.featuredImage?.url && (
          <div className="mb-12">
            <div className="relative w-full h-96 rounded-xl overflow-hidden">
              <Image
                src={page.featuredImage.url}
                alt={page.featuredImage.alt || page.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="prose prose-lg max-w-none">
          <LexicalContent content={page.content} />
        </div>
      </article>
    </div>
  )
}
