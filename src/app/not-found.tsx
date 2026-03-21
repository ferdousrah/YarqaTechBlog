import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', margin: '0 0 1rem' }}>404</h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Page not found</p>
        <Link href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>
          Return home
        </Link>
      </div>
    </div>
  )
}
