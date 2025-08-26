import { Suspense } from 'react'
import { LoginFormImproved } from './LoginFormImproved'

function LoginFallback() {
  return (
    <div className="min-h-[70vh] grid place-items-center p-6">
      <div className="w-full max-w-2xl border rounded-2xl p-6 md:p-8 shadow-sm bg-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginFormImproved />
    </Suspense>
  )
}
