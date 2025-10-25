// src/collections/Categories.ts - Payload 3.x
import type { CollectionConfig } from 'payload'

const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parent', 'postCount'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return !!(user && (user.role === 'admin' || user.role === 'editor'))
    },
    update: ({ req: { user } }) => {
      return !!(user && (user.role === 'admin' || user.role === 'editor'))
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.name) {
              return formatSlug(data.name)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 300,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Select parent to create subcategory',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_equals: id,
          },
        }
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex color (e.g., #FF5733)',
      },
    },
    {
      name: 'icon',
      type: 'select',
      options: [
        { label: 'Code', value: 'code' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Cloud', value: 'cloud' },
        { label: 'Database', value: 'database' },
        { label: 'Security', value: 'security' },
        { label: 'AI', value: 'ai' },
        { label: 'Design', value: 'design' },
        { label: 'Business', value: 'business' },
        { label: 'Tutorial', value: 'tutorial' },
        { label: 'News', value: 'news' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'postCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'seo',
      type: 'group',
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
      ],
    },
  ],
}
