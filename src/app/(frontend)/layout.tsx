// src/app/(frontend)/layout.tsx
import type { Metadata } from 'next'
import HeaderWrapper from '@/components/frontend/HeaderWrapper'
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
          <div className="flex flex-col min-h-screen">
            <HeaderWrapper />
            <main className="flex-grow">{children}</main>
            <FooterWrapper />
          </div>
          {/* Theme Debugger - Remove this in production */}
          <ThemeDebugger />
        </Providers>
      </body>
    </html>
  )
}
