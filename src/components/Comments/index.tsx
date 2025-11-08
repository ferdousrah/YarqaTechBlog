'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/Auth/AuthModal'

interface Author {
  id: string | number
  name: string
  avatar?: {
    url: string
    alt?: string
  }
}

interface Comment {
  id: string | number
  content: string
  author?: Author
  createdAt: string
  isEdited: boolean
  editedAt?: string
  likes: number
  replies?: Comment[]
}

interface CommentsProps {
  postId: string | number
  enableComments?: boolean
}

export function Comments({ postId, enableComments = true }: CommentsProps) {
  const postIdString = String(postId)
  const { user, loading: authLoading } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postIdString])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${postIdString}/comments`)
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

    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (!content.trim()) {
      setError('Comment cannot be empty')
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
          postId: postIdString,
          content: content.trim(),
          parentCommentId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(data.message || 'Comment submitted successfully!')
        setContent('')
        setReplyingTo(null)
        setTimeout(() => {
          fetchComments()
          setSuccessMessage(null)
        }, 2000)
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
    const authorName = comment.author?.name || 'Anonymous'

    return (
      <div className={`${isReply ? 'ml-8 mt-4' : 'mt-6'} border-l-2 border-gray-200 pl-4`}>
        <div className="flex items-start gap-3">
          {comment.author?.avatar?.url ? (
            <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0">
              <Image
                src={comment.author.avatar.url}
                alt={comment.author.avatar.alt || authorName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">{authorName}</span>
              <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
              {comment.isEdited && (
                <span className="text-xs text-gray-400 italic">(edited)</span>
              )}
            </div>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words">{comment.content}</p>
            <div className="mt-2 flex items-center gap-4">
              {!isReply && user && (
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
                <form onSubmit={(e) => handleSubmitComment(e, String(comment.id))}>
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
    <>
      <div className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>

        {/* Comment Form */}
        {!authLoading && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            {user ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <form onSubmit={(e) => handleSubmitComment(e)}>
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
                  <p className="text-sm text-gray-500 mt-1">{content.length}/1000 characters</p>

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

                  <div className="mt-4">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Post Comment'}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You need to be logged in to comment.</p>
                <Button onClick={() => setShowAuthModal(true)}>Login to Comment</Button>
              </div>
            )}
          </div>
        )}

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

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />
    </>
  )
}
