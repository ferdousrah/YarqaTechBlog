'use server'
// Dynamically imports handleServerFunctions so @payloadcms/next/layouts
// stays out of shared server-rendering chunks (prevents Html from
// next/document ending up in chunks loaded during /404 prerendering).
import config from '@payload-config'
import type { ServerFunctionClient } from 'payload'

import { importMap } from './importMap.js'

export const adminServerFunction: ServerFunctionClient = async function (args) {
  const { handleServerFunctions } = await import('@payloadcms/next/layouts')
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}
