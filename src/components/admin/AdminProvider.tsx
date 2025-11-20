'use client'

import React, { useEffect } from 'react'
import CustomAdminNav from './CustomAdminNav'

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hide Payload's default navigation with JavaScript as backup
    const hideDefaultNav = () => {
      const selectors = [
        'aside.template-default__nav',
        'nav[class*="nav__wrap"]',
        '.template-default aside',
        '[class*="template-default"] aside',
        'aside[class*="nav"]'
      ]

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(el => {
          if (el && !el.id.includes('custom')) {
            (el as HTMLElement).style.display = 'none'
          }
        })
      })
    }

    // Run immediately and on DOM changes
    hideDefaultNav()
    const observer = new MutationObserver(hideDefaultNav)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <CustomAdminNav />
      <div style={{ marginLeft: '280px' }}>
        {children}
      </div>
    </>
  )
}
