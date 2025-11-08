// src/app/api/user/upload-avatar/route.ts
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

    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload an image (JPEG, PNG, WebP, or GIF)' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Payload media collection
    const uploadedImage = await payload.create({
      collection: 'media',
      data: {
        alt: `${user.name}'s profile picture`,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    })

    // Update user's avatar
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        avatar: uploadedImage.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Avatar updated successfully',
      avatar: {
        id: uploadedImage.id,
        url: uploadedImage.url,
        alt: uploadedImage.alt,
      },
    })
  } catch (error) {
    console.error('Upload avatar error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload avatar: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    )
  }
}
