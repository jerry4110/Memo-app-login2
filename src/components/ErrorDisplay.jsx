import React from 'react'

function ErrorDisplay({ error, onRetry }) {
  if (!error) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-red-600 mb-4">오류 발생</h3>
        <div className="text-sm text-slate-700 mb-4 whitespace-pre-wrap">
          {error}
        </div>
        <div className="flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              다시 시도
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            페이지 새로고침
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorDisplay

