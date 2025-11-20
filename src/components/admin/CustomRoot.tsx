'use client'

import React from 'react'
import CustomAdminNav from './CustomAdminNav'

export default function CustomRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomAdminNav />
      <div style={{ marginLeft: '280px' }}>
        {children}
      </div>
    </>
  )
}
