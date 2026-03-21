import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
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
    <Providers>
      {children}
    </Providers>
  )
}
