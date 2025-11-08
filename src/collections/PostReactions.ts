// src/collections/PostReactions.ts - Track user reactions (like/dislike) on posts
import type { CollectionConfig } from 'payload'

export const PostReactions: CollectionConfig = {
  slug: 'post-reactions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'post', 'reactionType', 'createdAt'],
    group: 'Content',
    description: 'User reactions (likes/dislikes) on posts',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
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
      name: 'reactionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Like', value: 'like' },
        { label: 'Dislike', value: 'dislike' },
      ],
    },
  ],
  indexes: [
    {
      fields: {
        user: 1,
        post: 1,
      },
      options: {
        unique: true,
      },
    },
  ],
}
