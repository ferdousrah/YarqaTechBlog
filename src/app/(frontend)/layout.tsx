// src/app/(frontend)/layout.tsx
import type { Metadata } from 'next'
import SidebarWrapper from '@/components/frontend/SidebarWrapper'
import FooterWrapper from '@/components/frontend/FooterWrapper'
import { Providers } from '@/components/Providers'
import ThemeDebugger from '@/components/ThemeDebugger'
import { fontVariables } from '@/utils/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yarqa Tech Blog',
  description: 'Your source for tech news, tutorials, and insights',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-screen">
            <SidebarWrapper />
            <div className="flex flex-col flex-1 lg:ml-64">
              <main className="flex-grow">{children}</main>
              <FooterWrapper />
            </div>
          </div>
          {/* Theme Debugger - Remove this in production */}
          <ThemeDebugger />
        </Providers>
      </body>
    </html>
  )
}
