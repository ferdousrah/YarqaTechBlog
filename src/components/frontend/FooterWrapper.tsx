// src/components/frontend/FooterWrapper.tsx - Server component that fetches settings
import { getPayload } from 'payload'
import config from '@payload-config'
import Footer from './Footer'

export default async function FooterWrapper() {
  let settings = null

  try {
    const payload = await getPayload({ config })
    const result = await (payload.findGlobal as any)({
      slug: 'site-settings',
    })
    settings = result
  } catch (error) {
    console.error('Error fetching site settings:', error)
    // Use defaults if settings aren't available yet
  }

  return <Footer settings={settings} />
}
