'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Author {
  id: string
  name: string
}

interface Comment {
  id: string
  content: string
  author?: Author
  guestName?: string
  guestEmail?: string
  createdAt: string
  isEdited: boolean
  editedAt?: string
  likes: number
  replies?: Comment[]
}

interface CommentsProps {
  postId: string
  enableComments?: boolean
}

export function Comments({ postId, enableComments = true }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form state
  const [content, setContent] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${postId}/comments`)
      const data = await response.json()

      if (data.success) {
        setComments(data.comments)
      } else {
        setError('Failed to load comments')
      }
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent, parentCommentId?: string) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!content.trim()) {
      setError('Comment cannot be empty')
      return
    }

    if (!guestName.trim() || !guestEmail.trim()) {
      setError('Name and email are required')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: content.trim(),
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          parentCommentId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(data.message || 'Comment submitted successfully!')
        setContent('')
        setReplyingTo(null)
        // Optionally refresh comments after a delay
        setTimeout(() => {
          fetchComments()
          setSuccessMessage(null)
        }, 3000)
      } else {
        setError(data.error || 'Failed to submit comment')
      }
    } catch (err) {
      console.error('Error submitting comment:', err)
      setError('Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const [showReplyForm, setShowReplyForm] = useState(false)

    const authorName = comment.author?.name || comment.guestName || 'Anonymous'

    return (
      <div className={`${isReply ? 'ml-8 mt-4' : 'mt-6'} border-l-2 border-gray-200 pl-4`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{authorName}</span>
              <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
              {comment.isEdited && (
                <span className="text-xs text-gray-400 italic">(edited)</span>
              )}
            </div>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            <div className="mt-2 flex items-center gap-4">
              {!isReply && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reply
                </button>
              )}
            </div>

            {showReplyForm && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <form onSubmit={(e) => handleSubmitComment(e, comment.id)}>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your reply..."
                    className="mb-3"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={submitting} size="sm">
                      {submitting ? 'Posting...' : 'Post Reply'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReplyForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!enableComments) {
    return (
      <div className="mt-12 text-center text-gray-500">
        Comments are disabled for this post.
      </div>
    )
  }

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Comment Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
        <form onSubmit={(e) => handleSubmitComment(e)}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestName">Name *</Label>
                <Input
                  id="guestName"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="guestEmail">Email *</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="content">Comment *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                required
                rows={4}
                maxLength={1000}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                {content.length}/1000 characters
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          <div className="mt-6">
            <Button type="submit" disabled={submitting} className="w-full md:w-auto">
              {submitting ? 'Submitting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-gray-500">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  )
}
