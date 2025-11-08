// src/app/(frontend)/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import HeaderWrapper from '@/components/frontend/HeaderWrapper'
import FooterWrapper from '@/components/frontend/FooterWrapper'
import { Providers } from '@/components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Yarqa Tech Blog',
  description: 'Your source for tech news, tutorials, and insights',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-gray-900 antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <HeaderWrapper />
            <main className="flex-grow">{children}</main>
            <FooterWrapper />
          </div>
        </Providers>
      </body>
    </html>
  )
}
