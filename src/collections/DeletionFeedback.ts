// src/collections/DeletionFeedback.ts
import type { CollectionConfig } from 'payload'

export const DeletionFeedback: CollectionConfig = {
  slug: 'deletion-feedback',
  admin: {
    useAsTitle: 'reason',
    defaultColumns: ['reason', 'userEmail', 'createdAt'],
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
      name: 'reason',
      type: 'select',
      required: true,
      options: [
        { label: 'Not finding relevant content', value: 'not_relevant' },
        { label: 'Too many emails/notifications', value: 'too_many_emails' },
        { label: 'Privacy concerns', value: 'privacy' },
        { label: 'Found a better alternative', value: 'better_alternative' },
        { label: 'Technical issues', value: 'technical_issues' },
        { label: 'Not using the platform anymore', value: 'not_using' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'feedback',
      type: 'textarea',
      admin: {
        description: 'Additional feedback from the user',
      },
    },
    {
      name: 'userEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Email of the user who deleted their account',
      },
    },
    {
      name: 'userName',
      type: 'text',
      admin: {
        description: 'Name of the user who deleted their account',
      },
    },
  ],
}
