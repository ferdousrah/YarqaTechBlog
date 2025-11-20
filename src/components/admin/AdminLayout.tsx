'use client'

import React from 'react'
import CustomAdminNav from './CustomAdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout-wrapper">
      <CustomAdminNav />
      <div className="admin-layout-content">
        {children}
      </div>

      <style jsx global>{`
        .admin-layout-wrapper {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .admin-layout-content {
          margin-left: 280px;
          flex: 1;
          width: calc(100% - 280px);
        }

        /* Hide Payload's default nav */
        .payload-admin nav[class*="nav"],
        nav.nav,
        aside.nav {
          display: none !important;
        }

        /* Adjust main content area */
        .payload-admin main {
          margin-left: 0 !important;
        }

        .payload-admin .template-default {
          margin-left: 0 !important;
        }
      `}</style>
    </div>
  )
}
