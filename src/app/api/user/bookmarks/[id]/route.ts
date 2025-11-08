// src/app/api/user/bookmarks/[id]/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getPayload({ config })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get current user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify bookmark belongs to user
    const bookmark = await payload.findByID({
      collection: 'bookmarks',
      id,
    })

    if (typeof bookmark.user === 'object' && bookmark.user.id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    } else if (typeof bookmark.user === 'string' && bookmark.user !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete bookmark
    await payload.delete({
      collection: 'bookmarks',
      id,
    })

    return NextResponse.json({
      success: true,
      message: 'Bookmark removed successfully',
    })
  } catch (error) {
    console.error('Delete bookmark error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete bookmark: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    )
  }
}
