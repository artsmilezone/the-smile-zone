'use client'

interface Props {
  message: string
  onRetry?: () => void
}

export default function ErrorScreen({ message, onRetry }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 text-center smz-fade-in">
      <div className="flex justify-center mb-4">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
          <path d="M24 14v12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="34" r="2" fill="#ef4444" />
        </svg>
      </div>

      <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">Something went wrong</h2>
      <p className="text-gray-500 text-sm mb-6">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 rounded-xl bg-[#2d4aa8] text-white font-bold text-sm hover:bg-blue-800 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
