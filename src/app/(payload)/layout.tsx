/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
/* MODIFIED: RootLayout is dynamically imported to prevent @payloadcms/next/layouts
   (which contains <Html> from next/document) from landing in a shared webpack chunk
   that gets evaluated during /404 static prerendering. The server action is in a
   separate 'use server' file so it compiles into its own server-action bundle. */
import config from '@payload-config'
import '@payloadcms/next/css'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'
import { adminServerFunction } from './admin/adminServerFn'

type Args = {
  children: React.ReactNode
}

export default async function Layout({ children }: Args) {
  const { RootLayout } = await import('@payloadcms/next/layouts')
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={adminServerFunction}>
      {children}
    </RootLayout>
  )
}
