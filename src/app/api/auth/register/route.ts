// src/app/api/auth/register/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { name, email, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: { equals: email.toLowerCase() },
      },
      limit: 1,
    })

    if (existingUsers.docs.length > 0) {
      return NextResponse.json(
        { success: false, error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = await payload.create({
      collection: 'users',
      data: {
        name,
        email: email.toLowerCase(),
        password,
        role: 'user',
      },
    })

    // Log the user in automatically
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: email.toLowerCase(),
        password,
      },
    })

    // Create response with auth token
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
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
    console.error('Registration error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Registration failed: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    )
  }
}
