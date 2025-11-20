// src/app/api/logout-feedback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { rating, feedback, sessionDuration, userEmail, userName } = body

    if (!rating || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'Rating and user email are required' },
        { status: 400 }
      )
    }

    await payload.create({
      collection: 'logout-feedback',
      data: {
        rating,
        feedback: feedback || '',
        sessionDuration: sessionDuration || 0,
        userEmail,
        userName: userName || '',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!',
    })
  } catch (error) {
    console.error('Logout feedback error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}
