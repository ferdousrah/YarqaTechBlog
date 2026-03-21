/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
/* MODIFIED: Dynamic imports prevent @payloadcms/next/views (which contains
   <Html> from next/document) from landing in shared webpack chunks that are
   evaluated during /404 static prerendering. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  const { generatePageMetadata } = await import('@payloadcms/next/views')
  return generatePageMetadata({ config, params, searchParams })
}

const Page = async ({ params, searchParams }: Args) => {
  const { RootPage } = await import('@payloadcms/next/views')
  return RootPage({ config, params, searchParams, importMap })
}

export default Page
