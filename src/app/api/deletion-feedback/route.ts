// src/app/api/deletion-feedback/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const { reason, feedback, userEmail, userName } = body

    if (!reason || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'Reason and email are required' },
        { status: 400 }
      )
    }

    // Create deletion feedback entry
    await payload.create({
      collection: 'deletion-feedback' as any,
      data: {
        reason,
        feedback: feedback || '',
        userEmail,
        userName: userName || '',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting deletion feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}
