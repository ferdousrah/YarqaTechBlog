// src/components/frontend/SidebarWrapper.tsx - Server component that fetches categories
import { getPayload } from 'payload'
import config from '@payload-config'
import Sidebar from './Sidebar'

export default async function SidebarWrapper() {
  let categories: any[] = []
  let settings = null

  try {
    const payload = await getPayload({ config })

    // Fetch categories
    const categoriesResult = await payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'name',
    })
    categories = categoriesResult.docs

    // Fetch site settings for logo
    const settingsResult = await payload.findGlobal({
      slug: 'site-settings',
    })
    settings = settingsResult
  } catch (error) {
    console.error('Error fetching sidebar data:', error)
  }

  return <Sidebar categories={categories} settings={settings} />
}
