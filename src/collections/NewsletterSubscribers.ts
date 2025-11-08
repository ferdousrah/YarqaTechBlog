// src/collections/NewsletterSubscribers.ts
import type { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: {
    singular: 'Newsletter Subscriber',
    plural: 'Newsletter Subscribers',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'subscribedAt'],
    group: 'Marketing',
  },
  access: {
    read: ({ req: { user } }) => {
      // Only admins can read subscribers
      return user?.role === 'admin'
    },
    create: () => true, // Anyone can subscribe
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Subscriber email address',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'subscribed',
      options: [
        {
          label: 'Subscribed',
          value: 'subscribed',
        },
        {
          label: 'Unsubscribed',
          value: 'unsubscribed',
        },
        {
          label: 'Bounced',
          value: 'bounced',
        },
      ],
      admin: {
        description: 'Subscription status',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'Date when the user subscribed',
        readOnly: true,
      },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: {
        description: 'Date when the user unsubscribed',
        condition: (data) => data.status === 'unsubscribed',
      },
    },
    {
      name: 'source',
      type: 'select',
      options: [
        {
          label: 'Homepage',
          value: 'homepage',
        },
        {
          label: 'Blog Post',
          value: 'blog-post',
        },
        {
          label: 'Footer',
          value: 'footer',
        },
        {
          label: 'Manual',
          value: 'manual',
        },
      ],
      defaultValue: 'homepage',
      admin: {
        description: 'Where the subscription originated',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'IP address of subscriber (for security)',
        readOnly: true,
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'Browser user agent',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Set unsubscribedAt date when status changes to unsubscribed
        if (operation === 'update' && data.status === 'unsubscribed' && !data.unsubscribedAt) {
          data.unsubscribedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
