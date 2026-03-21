/**
 * Node.js ESM loader hook that intercepts CSS/SCSS imports from external
 * packages loaded at runtime (e.g. @payloadcms/ui importing react-image-crop
 * CSS when @payloadcms/next is in serverExternalPackages).
 *
 * Loaded via NODE_OPTIONS="--import ./src/server/css-noop.mjs"
 * Does NOT affect webpack's CSS processing — only Node.js native ESM imports.
 */
import { register } from 'node:module'

const loaderCode = `
const NOOP_EXTS = ['.css', '.scss', '.sass', '.less', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot']
const NOOP_URL = 'data:text/javascript,export default ""'

export async function resolve(specifier, context, nextResolve) {
  const base = specifier.split('?')[0]
  if (NOOP_EXTS.some((ext) => base.endsWith(ext))) {
    return { shortCircuit: true, url: NOOP_URL }
  }
  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (url === NOOP_URL) {
    return { format: 'module', shortCircuit: true, source: 'export default ""' }
  }
  return nextLoad(url, context)
}
`

register('data:text/javascript,' + encodeURIComponent(loaderCode), import.meta.url)
