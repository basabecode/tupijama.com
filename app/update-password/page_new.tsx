import { Suspense } from 'react'
import { UpdatePasswordForm } from './UpdatePasswordForm'

function UpdatePasswordFallback() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="w-full max-w-sm border rounded-lg p-6 shadow-sm bg-white">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<UpdatePasswordFallback />}>
      <UpdatePasswordForm />
    </Suspense>
  )
}
