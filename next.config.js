import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'payload',
    '@payloadcms/next',
    '@payloadcms/ui',
    '@payloadcms/richtext-lexical',
    '@payloadcms/db-postgres',
    '@payloadcms/plugin-seo',
    '@payloadcms/plugin-redirects',
    '@payloadcms/plugin-nested-docs',
    '@payloadcms/plugin-search',
    '@payloadcms/plugin-form-builder',
    '@payloadcms/payload-cloud',
    '@payloadcms/admin-bar',
    '@payloadcms/live-preview-react',
    // Prevents the App Router webpack stub for next/document (which throws
    // "<Html> should not be imported outside of pages/_document" at module
    // evaluation time) from firing when Payload packages transitively import it.
    // Externalizing bypasses the stub replacement so the real Node.js module
    // is loaded instead, which does NOT throw at import time.
    'next/document',
  ],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    if (isServer) {
      // withPayload() REPLACES nextConfig.serverExternalPackages with its own list,
      // so additions to serverExternalPackages above have no effect. We must add
      // next/document directly to webpackConfig.externals here instead.
      //
      // next/document is replaced by an App Router webpack stub that throws
      // "<Html> should not be imported outside of pages/_document" at module
      // evaluation time. Externalizing it generates require('next/document')
      // instead, loading the real Node.js module which does NOT throw at import time.
      if (Array.isArray(webpackConfig.externals)) {
        webpackConfig.externals.push('next/document')
      } else if (webpackConfig.externals) {
        webpackConfig.externals = [webpackConfig.externals, 'next/document']
      } else {
        webpackConfig.externals = ['next/document']
      }
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
