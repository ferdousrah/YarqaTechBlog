/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
/* MODIFIED: replaced NotFoundPage (which renders <Html> from next/document) with
   a simple App Router-compatible component to prevent build-time prerender errors. */
import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0 0 1rem' }}>404</h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Admin page not found</p>
        <Link href="/admin" style={{ color: '#2563eb', textDecoration: 'underline' }}>
          Return to admin
        </Link>
      </div>
    </div>
  )
}
