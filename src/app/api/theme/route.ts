// src/app/api/theme/route.ts - Theme settings API
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Fetch site settings
    const settings = await payload.findGlobal({
      slug: 'site-settings',
    })

    // Extract and return theme settings with defaults
    const theme = {
      colors: {
        primary: settings?.theme?.colors?.primary || '#2563eb',
        secondary: settings?.theme?.colors?.secondary || '#6366f1',
        accent: settings?.theme?.colors?.accent || '#8b5cf6',
        success: settings?.theme?.colors?.success || '#10b981',
        warning: settings?.theme?.colors?.warning || '#f59e0b',
        error: settings?.theme?.colors?.error || '#ef4444',
        background: settings?.theme?.colors?.background || '#ffffff',
        backgroundSecondary: settings?.theme?.colors?.backgroundSecondary || '#f9fafb',
        text: settings?.theme?.colors?.text || '#111827',
        textSecondary: settings?.theme?.colors?.textSecondary || '#6b7280',
        border: settings?.theme?.colors?.border || '#e5e7eb',
      },
      typography: {
        fontFamily: settings?.theme?.typography?.fontFamily || 'inter',
        headingFontFamily: settings?.theme?.typography?.headingFontFamily || 'inter',
        baseFontSize: settings?.theme?.typography?.baseFontSize || 16,
        lineHeight: settings?.theme?.typography?.lineHeight || 1.6,
        headingWeight: settings?.theme?.typography?.headingWeight || '700',
      },
      spacing: {
        containerMaxWidth: settings?.theme?.spacing?.containerMaxWidth || '1400px',
        borderRadius: settings?.theme?.spacing?.borderRadius || 'medium',
        shadowStyle: settings?.theme?.spacing?.shadowStyle || 'medium',
      },
      buttons: {
        style: settings?.theme?.buttons?.style || 'gradient',
        buttonRadius: settings?.theme?.buttons?.buttonRadius || 'medium',
      },
      animations: {
        enableAnimations: settings?.theme?.animations?.enableAnimations !== false,
        animationSpeed: settings?.theme?.animations?.animationSpeed || 'normal',
      },
    }

    return NextResponse.json({
      success: true,
      theme,
    })
  } catch (error) {
    console.error('Error fetching theme settings:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch theme settings',
      },
      { status: 500 },
    )
  }
}
