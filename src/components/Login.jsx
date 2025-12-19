import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()

  // user가 있으면 (로그인 성공 후) 아무것도 렌더링하지 않음
  useEffect(() => {
    if (user) {
      console.log('✅ 로그인 성공! user 상태 확인됨:', user)
    }
  }, [user])

  // user가 있으면 컴포넌트를 렌더링하지 않음
  if (user) {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(email, password)
      
      if (!result.success) {
        setError(result.error || '로그인에 실패했습니다')
        setLoading(false)
      } else {
        // 성공 시 자동으로 메모 화면으로 전환됨
      }
    } catch (err) {
      setError('알 수 없는 오류가 발생했습니다')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          로그인
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            계정이 없으신가요?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-rose-500 hover:text-rose-600 font-semibold"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

