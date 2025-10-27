// src/app/(frontend)/page.tsx
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Yarqa Tech Blog</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your source for tech news, tutorials, and insights
        </p>
        <div className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
          Coming Soon
        </div>
      </div>
    </div>
  )
}
