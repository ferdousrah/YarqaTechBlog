// src/app/api/newsletter/subscribe/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { email, source = 'homepage' } = body

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
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

    // Check if email already exists
    const existingSubscriber = await payload.find({
      collection: 'newsletter-subscribers' as any,
      where: {
        email: { equals: email.toLowerCase() },
      },
      limit: 1,
    })

    if (existingSubscriber.docs.length > 0) {
      const subscriber = existingSubscriber.docs[0]

      // If previously unsubscribed, resubscribe
      if (subscriber.status === 'unsubscribed') {
        await payload.update({
          collection: 'newsletter-subscribers' as any,
          id: subscriber.id,
          data: {
            status: 'subscribed',
            subscribedAt: new Date().toISOString(),
            unsubscribedAt: null,
          },
        })
        return NextResponse.json({
          success: true,
          message: 'Successfully resubscribed to newsletter!',
        })
      }

      return NextResponse.json(
        { success: false, error: 'This email is already subscribed' },
        { status: 409 }
      )
    }

    // Get IP and User Agent for security tracking
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create new subscriber
    await payload.create({
      collection: 'newsletter-subscribers' as any,
      data: {
        email: email.toLowerCase(),
        status: 'subscribed',
        source,
        ipAddress,
        userAgent,
        subscribedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to subscribe. Please try again later.',
      },
      { status: 500 }
    )
  }
}
