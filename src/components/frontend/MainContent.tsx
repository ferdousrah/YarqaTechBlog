'use client'

import { useSidebar } from '@/contexts/SidebarContext'
import { ReactNode } from 'react'

interface MainContentProps {
  children: ReactNode
}

export default function MainContent({ children }: MainContentProps) {
  const { isCollapsed } = useSidebar()

  return (
    <div
      className={`
        flex flex-col flex-1 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
      `}
    >
      {children}
    </div>
  )
}
