import React, { useState, useEffect } from 'react'
import Login from './Login'
import Signup from './Signup'
import { testApiConnection } from '../utils/apiTest.js'
import { API_URL } from '../config/api.js'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [apiStatus, setApiStatus] = useState(null)

  useEffect(() => {
    // API 연결 테스트
    testApiConnection().then(result => {
      setApiStatus(result)
      if (!result.success) {
        console.error('⚠️ API 연결 문제:', result.error)
      }
    })
  }, [])

  // API URL이 설정되지 않은 경우
  const isApiUrlMissing = !API_URL || API_URL === ''

  return (
    <>
      {(isApiUrlMissing || (apiStatus && !apiStatus.success)) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4 rounded-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                ⚠️ API 서버 연결이 설정되지 않았습니다
              </h3>
              {isApiUrlMissing ? (
                <div className="text-sm text-red-700 space-y-2">
                  <p>
                    <strong>문제:</strong> Vercel 환경 변수에 API 서버 URL이 설정되지 않았습니다.
                  </p>
                  <div className="bg-red-100 p-3 rounded mt-2">
                    <p className="font-semibold mb-1">해결 방법:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Vercel Dashboard → 프로젝트 선택 → Settings → Environment Variables</li>
                      <li>Key: <code className="bg-red-200 px-1 rounded">VITE_API_URL</code></li>
                      <li>Value: <code className="bg-red-200 px-1 rounded">https://your-backend.onrender.com/api</code></li>
                      <li>Production, Preview, Development 모두 체크</li>
                      <li>저장 후 재배포 (Redeploy)</li>
                    </ol>
                  </div>
                  <p className="text-xs text-red-600 mt-2">
                    💡 <strong>참고:</strong> 백엔드 서버가 Render/Railway에 배포되어 있어야 합니다.
                  </p>
                </div>
              ) : (
                <div className="text-sm text-red-700">
                  <p>{apiStatus?.error}</p>
                  {API_URL && <p className="mt-1 text-xs">현재 API URL: <code>{API_URL}</code></p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isLogin ? (
        <Login onSwitchToSignup={() => setIsLogin(false)} />
      ) : (
        <Signup onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </>
  )
}

export default Auth

