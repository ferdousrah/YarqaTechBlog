'use server'
// This file is intentionally separate from the layout so that
// @payloadcms/next/layouts is compiled into a server-action bundle,
// NOT into the shared server rendering chunks. This prevents RootLayout
// (which uses <Html> from next/document) from being loaded during /404
// static prerendering, which would cause a build-time error.
import config from '@payload-config'
import { handleServerFunctions } from '@payloadcms/next/layouts'
import type { ServerFunctionClient } from 'payload'

import { importMap } from './importMap.js'

export const adminServerFunction: ServerFunctionClient = async function (args) {
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}
