// src/collections/ReadingProgress.ts - Track reading progress
import type { CollectionConfig } from 'payload'

export const ReadingProgress: CollectionConfig = {
  slug: 'reading-progress',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'post', 'progress', 'updatedAt'],
    group: 'Analytics',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return {
        user: {
          equals: user?.id,
        },
      }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return {
        user: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return {
        user: {
          equals: user?.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      index: true,
    },
    {
      name: 'progress',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      admin: {
        description: 'Reading progress percentage (0-100)',
      },
    },
    {
      name: 'completed',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create' && req.user) {
          data.user = req.user.id
        }
        if (data.progress >= 95) {
          data.completed = true
        }
        return data
      },
    ],
  },
}
