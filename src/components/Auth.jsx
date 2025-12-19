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

  return (
    <>
      {apiStatus && !apiStatus.success && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>⚠️ API 서버 연결 확인 필요</strong>
                <br />
                {apiStatus.error}
                <br />
                <small>현재 API URL: {API_URL}</small>
              </p>
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

