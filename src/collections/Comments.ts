// src/collections/Comments.ts - Payload 3.x
import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['author', 'post', 'status', 'createdAt'],
    group: 'Content',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user && (user.role === 'admin' || user.role === 'editor')) {
        return true
      }
      return {
        status: {
          equals: 'approved',
        },
      }
    },
    create: () => true, // Allow anyone to create comments (guest or authenticated)
    update: ({ req: { user } }) => {
      if (user?.role === 'admin' || user?.role === 'editor') return true
      return {
        author: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin' || user?.role === 'editor') return true
      return {
        author: {
          equals: user?.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 1000,
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'guestName',
      type: 'text',
      admin: {
        description: 'Name for guest commenters',
        condition: (data) => !data?.author,
      },
    },
    {
      name: 'guestEmail',
      type: 'email',
      admin: {
        description: 'Email for guest commenters',
        condition: (data) => !data?.author,
      },
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'comments',
      admin: {
        description: 'Reply to another comment',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Spam', value: 'spam' },
        { label: 'Deleted', value: 'deleted' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'isEdited',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'editedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create') {
          if (req.user) {
            data.author = req.user.id
          }
          // Auto-approve comments from authenticated users with admin/editor role
          if (req.user && (req.user.role === 'admin' || req.user.role === 'editor')) {
            data.status = 'approved'
          } else {
            data.status = 'pending'
          }
        }

        if (operation === 'update' && data.content) {
          data.isEdited = true
          data.editedAt = new Date().toISOString()
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // Update post comments count when a comment is approved
        if (operation === 'create' || operation === 'update') {
          if (doc.status === 'approved' && doc.post) {
            try {
              const payload = req.payload
              const postId = typeof doc.post === 'object' ? doc.post.id : doc.post

              // Count approved comments for this post
              const commentsCount = await payload.count({
                collection: 'comments',
                where: {
                  post: { equals: postId },
                  status: { equals: 'approved' },
                },
              })

              // Update post's commentsCount
              await payload.update({
                collection: 'posts',
                id: postId,
                data: {
                  commentsSettings: {
                    commentsCount: commentsCount.totalDocs,
                  },
                },
              })
            } catch (error) {
              req.payload.logger.error('Error updating comments count:', error)
            }
          }
        }
      },
    ],
  },
}
