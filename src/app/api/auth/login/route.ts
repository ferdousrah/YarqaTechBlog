// src/app/api/auth/login/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Attempt to log in
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: email.toLowerCase(),
        password,
      },
    })

    if (!loginResult.user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update user login tracking
    try {
      await payload.update({
        collection: 'users',
        id: loginResult.user.id,
        data: {
          lastLoginAt: new Date().toISOString(),
          loginCount: ((loginResult.user as any).loginCount || 0) + 1,
        } as any,
      })
    } catch (trackingError) {
      console.error('Failed to update login tracking:', trackingError)
      // Don't fail login if tracking fails
    }

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: loginResult.user.id,
        name: loginResult.user.name,
        email: loginResult.user.email,
        role: loginResult.user.role,
      },
    })

    // Set auth cookie
    if (loginResult.token) {
      response.cookies.set('payload-token', loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      })
    }

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Login failed: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 401 }
    )
  }
}
