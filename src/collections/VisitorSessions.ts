// src/collections/VisitorSessions.ts
import type { CollectionConfig } from 'payload'

export const VisitorSessions: CollectionConfig = {
  slug: 'visitor-sessions',
  admin: {
    useAsTitle: 'visitorId',
    defaultColumns: ['visitorId', 'country', 'source', 'createdAt'],
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
      admin: {
        description: 'Unique identifier for the visitor (cookie-based)',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Logged in user if applicable',
      },
    },
    {
      name: 'isNewVisitor',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'startTime',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endTime',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        description: 'Session duration in seconds',
      },
    },
    {
      name: 'pageViews',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'bounced',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Visitor left after viewing only one page',
      },
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Direct', value: 'direct' },
        { label: 'Organic Search', value: 'organic' },
        { label: 'Social Media', value: 'social' },
        { label: 'Referral', value: 'referral' },
        { label: 'Email', value: 'email' },
        { label: 'Paid', value: 'paid' },
      ],
      defaultValue: 'direct',
    },
    {
      name: 'referrer',
      type: 'text',
      admin: {
        description: 'Full referrer URL',
      },
    },
    {
      name: 'utmSource',
      type: 'text',
    },
    {
      name: 'utmMedium',
      type: 'text',
    },
    {
      name: 'utmCampaign',
      type: 'text',
    },
    {
      name: 'country',
      type: 'text',
      index: true,
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'region',
      type: 'text',
    },
    {
      name: 'device',
      type: 'select',
      options: [
        { label: 'Desktop', value: 'desktop' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
      ],
    },
    {
      name: 'browser',
      type: 'text',
    },
    {
      name: 'os',
      type: 'text',
    },
    {
      name: 'userAgent',
      type: 'text',
    },
    {
      name: 'ip',
      type: 'text',
    },
    {
      name: 'entryPage',
      type: 'text',
      admin: {
        description: 'First page visited in session',
      },
    },
    {
      name: 'exitPage',
      type: 'text',
      admin: {
        description: 'Last page visited in session',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this session currently active',
      },
    },
  ],
}
