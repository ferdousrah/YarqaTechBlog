// src/app/api/user/update-profile/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, bio, socialLinks } = body

    // Update user profile
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        name,
        bio,
        socialLinks,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update profile: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    )
  }
}
