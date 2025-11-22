// src/components/frontend/SidebarWrapper.tsx - Server component that fetches categories
import { getPayload } from 'payload'
import config from '@payload-config'
import Sidebar from './Sidebar'

export default async function SidebarWrapper() {
  let categories: any[] = []
  let settings = null

  try {
    const payload = await getPayload({ config })

    // Fetch all categories with depth to get parent relationships
    const categoriesResult = await payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'name',
      depth: 1,
    })

    // Organize categories into parent-child hierarchy
    const categoryMap = new Map()
    const rootCategories: any[] = []

    // First pass: create map of all categories
    categoriesResult.docs.forEach((category: any) => {
      categoryMap.set(category.id, { ...category, children: [] })
    })

    // Second pass: organize hierarchy
    categoriesResult.docs.forEach((category: any) => {
      const categoryObj = categoryMap.get(category.id)
      if (category.parent && typeof category.parent === 'object') {
        const parentCategory = categoryMap.get(category.parent.id)
        if (parentCategory) {
          parentCategory.children.push(categoryObj)
        }
      } else if (!category.parent) {
        rootCategories.push(categoryObj)
      }
    })

    categories = rootCategories

    // Fetch site settings for logo
    const settingsResult = await (payload.findGlobal as any)({
      slug: 'site-settings',
    })
    settings = settingsResult
  } catch (error) {
    console.error('Error fetching sidebar data:', error)
  }

  return <Sidebar categories={categories} settings={settings} />
}
