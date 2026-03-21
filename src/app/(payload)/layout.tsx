/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
/* MODIFIED: ALL Payload imports are dynamic — @payloadcms/next/layouts,
   importMap (which pulls in @payloadcms/richtext-lexical), and @payload-config
   (which pulls in payload.config.ts + all collections/endpoints) are deferred
   so NOTHING from Payload lands in shared webpack server chunks evaluated
   during /404 static prerendering. */
import '@payloadcms/next/css'
import React from 'react'

import './custom.scss'
import { adminServerFunction } from './admin/adminServerFn'

type Args = {
  children: React.ReactNode
}

export default async function Layout({ children }: Args) {
  const [{ RootLayout }, { importMap }, { default: config }] = await Promise.all([
    import('@payloadcms/next/layouts'),
    import('./admin/importMap.js'),
    import('@payload-config'),
  ])
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={adminServerFunction}>
      {children}
    </RootLayout>
  )
}
