import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import { fontVariables } from '@/utils/fonts'
import '../(frontend)/globals.css'

export const metadata: Metadata = {
  title: 'Yarqa Tech Blog',
  description: 'Your source for tech news and insights',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
