// src/collections/PostViews.ts - Track post views
import type { CollectionConfig } from 'payload'

export const PostViews: CollectionConfig = {
  slug: 'post-views',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['post', 'user', 'createdAt'],
    group: 'Analytics',
    description: 'Track post views for analytics',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'ipAddress',
      type: 'text',
    },
    {
      name: 'userAgent',
      type: 'text',
    },
    {
      name: 'referrer',
      type: 'text',
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        description: 'Time spent on page in seconds',
      },
    },
  ],
}
