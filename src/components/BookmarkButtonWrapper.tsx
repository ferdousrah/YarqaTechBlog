'use client'

import BookmarkButton from './BookmarkButton'

interface BookmarkButtonWrapperProps {
  postId: string
  variant?: 'default' | 'icon-only' | 'large'
  className?: string
  showLabel?: boolean
}

export default function BookmarkButtonWrapper({
  postId,
  variant = 'large',
  className = '',
  showLabel = true,
}: BookmarkButtonWrapperProps) {
  return (
    <BookmarkButton
      postId={postId}
      variant={variant}
      className={className}
      showLabel={showLabel}
    />
  )
}
