// src/collections/SearchQueries.ts - Track search queries
import type { CollectionConfig } from 'payload'

export const SearchQueries: CollectionConfig = {
  slug: 'search-queries',
  admin: {
    useAsTitle: 'query',
    defaultColumns: ['query', 'resultsCount', 'createdAt'],
    group: 'Analytics',
    description: 'Track user search queries',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'query',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'resultsCount',
      type: 'number',
      defaultValue: 0,
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
  ],
}
