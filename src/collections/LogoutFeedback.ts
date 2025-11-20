// src/collections/LogoutFeedback.ts
import type { CollectionConfig } from 'payload'

export const LogoutFeedback: CollectionConfig = {
  slug: 'logout-feedback',
  admin: {
    useAsTitle: 'userEmail',
    defaultColumns: ['userEmail', 'rating', 'createdAt'],
    group: 'Analytics',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'userEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'userName',
      type: 'text',
    },
    {
      name: 'rating',
      type: 'select',
      required: true,
      options: [
        { label: '⭐ (Very Poor)', value: '1' },
        { label: '⭐⭐ (Poor)', value: '2' },
        { label: '⭐⭐⭐ (Average)', value: '3' },
        { label: '⭐⭐⭐⭐ (Good)', value: '4' },
        { label: '⭐⭐⭐⭐⭐ (Excellent)', value: '5' },
      ],
    },
    {
      name: 'feedback',
      type: 'textarea',
      admin: {
        description: 'Optional feedback from the user',
      },
    },
    {
      name: 'sessionDuration',
      type: 'number',
      admin: {
        description: 'Session duration in seconds',
      },
    },
  ],
}
