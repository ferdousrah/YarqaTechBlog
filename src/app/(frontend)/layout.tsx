// src/app/(frontend)/layout.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import HeaderWrapper from '@/components/frontend/HeaderWrapper'
import SidebarWrapper from '@/components/frontend/SidebarWrapper'
import FooterWrapper from '@/components/frontend/FooterWrapper'
import MainContent from '@/components/frontend/MainContent'
import { Providers } from '@/components/Providers'
import ThemeDebugger from '@/components/ThemeDebugger'
import VisitorTracker from '@/components/frontend/VisitorTracker'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yarqa Tech Blog',
  description: 'Your source for tech news, tutorials, and insights',
}

// Render all frontend pages dynamically so newly published posts/categories
// appear immediately. Without this, the home page and sidebar are statically
// cached and keep showing stale data until a redeploy (there are no
// afterChange revalidation hooks wired up to invalidate them).
export const dynamic = 'force-dynamic'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>
      <div className="flex min-h-screen">
        <SidebarWrapper />
        <MainContent>
          <HeaderWrapper />
          <main className="flex-grow">{children}</main>
          <FooterWrapper />
        </MainContent>
      </div>
      {/* Theme Debugger - Remove this in production */}
      <ThemeDebugger />
    </Providers>
  )
}
