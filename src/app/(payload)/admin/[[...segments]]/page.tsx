/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
/* MODIFIED: ALL Payload imports are dynamic — @payloadcms/next/views and
   @payload-config are deferred so nothing from Payload lands in shared
   webpack server chunks evaluated during /404 static prerendering. */
import type { Metadata } from 'next'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  const [{ generatePageMetadata }, { default: config }] = await Promise.all([
    import('@payloadcms/next/views'),
    import('@payload-config'),
  ])
  return generatePageMetadata({ config, params, searchParams })
}

const Page = async ({ params, searchParams }: Args) => {
  const [{ RootPage }, { importMap }, { default: config }] = await Promise.all([
    import('@payloadcms/next/views'),
    import('../importMap'),
    import('@payload-config'),
  ])
  return RootPage({ config, params, searchParams, importMap })
}

export default Page
