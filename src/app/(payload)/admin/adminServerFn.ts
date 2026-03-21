'use server'
// ALL Payload imports are dynamic so payload.config.ts and its local imports
// (collections, endpoints, globals) never land in shared server chunks that
// are evaluated during /404 static prerendering.
import type { ServerFunctionClient } from 'payload'

export const adminServerFunction: ServerFunctionClient = async function (args) {
  const [{ handleServerFunctions }, { importMap }, { default: config }] = await Promise.all([
    import('@payloadcms/next/layouts'),
    import('./importMap.js'),
    import('@payload-config'),
  ])
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}
