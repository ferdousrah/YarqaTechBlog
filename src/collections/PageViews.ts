// src/collections/PageViews.ts
import type { CollectionConfig } from 'payload'

export const PageViews: CollectionConfig = {
  slug: 'page-views',
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'title', 'visitorId', 'createdAt'],
    group: 'Analytics',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: () => true,
    update: () => true,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'visitorId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'session',
      type: 'relationship',
      relationTo: 'visitor-sessions',
      admin: {
        description: 'Related visitor session',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'path',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Page URL path',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Page title',
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      admin: {
        description: 'Related post if viewing a blog post',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Related category if viewing a category page',
      },
    },
    {
      name: 'referrer',
      type: 'text',
      admin: {
        description: 'Previous page within the site',
      },
    },
    {
      name: 'timeOnPage',
      type: 'number',
      admin: {
        description: 'Time spent on page in seconds',
      },
    },
    {
      name: 'scrollDepth',
      type: 'number',
      admin: {
        description: 'Maximum scroll depth percentage (0-100)',
      },
    },
    {
      name: 'exitPage',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Was this the last page in the session',
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  indexes: [
    {
      fields: { path: 1, createdAt: -1 },
    },
    {
      fields: { sessionId: 1 },
    },
    {
      fields: { visitorId: 1 },
    },
  ],
}
