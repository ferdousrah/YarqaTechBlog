// src/collections/Posts.ts - Payload 3.x with Milestone 2 features
import type { CollectionConfig } from 'payload'

const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedAt', 'views'],
    group: 'Content',
    description: 'Manage blog posts with rich content',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000,
      },
    },
    maxPerDoc: 20,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user && (user.role === 'admin' || user.role === 'editor')) {
        return true
      }
      return {
        status: {
          equals: 'published',
        },
      }
    },
    create: ({ req: { user } }) => {
      return !!(user && (user.role === 'admin' || user.role === 'editor'))
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user?.role === 'editor') {
        return {
          author: {
            equals: user.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 200,
      admin: {
        description: 'The main title of your post (max 200 characters)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.title) {
              return formatSlug(data.title)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
      required: true,
      admin: {
        description: 'Brief summary shown in post listings (max 300 characters)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main image displayed with the post',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      admin: {
        description: 'Additional images for the post',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When to publish this post',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Display as featured on homepage',
      },
    },
    {
      name: 'trending',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mark as trending',
      },
    },
    {
      name: 'readTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Reading time in minutes',
      },
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'dislikes',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'shares',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    // Social Sharing
    {
      name: 'socialSharing',
      type: 'group',
      admin: {
        description: 'Social media sharing settings',
      },
      fields: [
        {
          name: 'enableTwitter',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'enableLinkedIn',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'enableFacebook',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'enableWhatsApp',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'customShareText',
          type: 'textarea',
          maxLength: 280,
        },
      ],
    },
    // Video Embedding
    {
      name: 'videoEmbed',
      type: 'group',
      fields: [
        {
          name: 'hasVideo',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'videoUrl',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.hasVideo,
          },
        },
        {
          name: 'videoPosition',
          type: 'select',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Bottom', value: 'bottom' },
            { label: 'Inline', value: 'inline' },
          ],
          defaultValue: 'top',
          admin: {
            condition: (data, siblingData) => siblingData?.hasVideo,
          },
        },
      ],
    },
    // Related Posts
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxDepth: 1,
      admin: {
        description: 'Select related posts',
      },
    },
    // SEO
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          maxLength: 60,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          maxLength: 160,
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'keywords',
          type: 'text',
        },
        {
          name: 'canonicalUrl',
          type: 'text',
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    // Comments
    {
      name: 'commentsSettings',
      type: 'group',
      fields: [
        {
          name: 'enableComments',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'commentsCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create' && req.user) {
          data.author = req.user.id
        }

        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        // Calculate read time
        if (data.content) {
          const text = JSON.stringify(data.content)
          const words = text.split(/\s+/).length
          data.readTime = Math.ceil(words / 200)
        }

        return data
      },
    ],
  },
}
