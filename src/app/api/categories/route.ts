// src/app/api/categories/route.ts - API endpoint to fetch categories
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const categories = await payload.find({
      collection: 'categories',
      depth: 0,
      limit: 100,
      sort: 'order',
    })

    return NextResponse.json({
      success: true,
      categories: categories.docs,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 },
    )
  }
}
