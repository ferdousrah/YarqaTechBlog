import { getPayload } from 'payload'
import config from '@payload-config'
import Newsletter from './Newsletter'

export default async function NewsletterWrapper() {
  let settings = null
  try {
    const payload = await getPayload({ config })
    const result = await payload.findGlobal({ slug: 'site-settings' })
    settings = result
  } catch (error) {
    console.error('Error fetching site settings:', error)
  }

  return <Newsletter settings={settings} />
}
