// src/app/api/auth/logout/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Log out from Payload
    await payload.logout({
      collection: 'users',
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    })

    // Clear auth cookie
    response.cookies.delete('payload-token')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}
