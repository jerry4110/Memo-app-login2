import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function Signup({ onSwitchToLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, user } = useAuth()

  // user가 있으면 (회원가입 성공 후) 아무것도 렌더링하지 않음
  // App.jsx에서 자동으로 메모 화면으로 전환됨
  useEffect(() => {
    if (user) {
      console.log('✅ 회원가입 성공! user 상태 확인됨:', user)
    }
  }, [user])

  // user가 있으면 컴포넌트를 렌더링하지 않음
  if (user) {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await register(username, email, password)
      
      if (!result.success) {
        setError(result.error || '회원가입에 실패했습니다')
        setLoading(false)
      } else {
        // 성공 시 - user state가 업데이트되어 App.jsx에서 자동으로 메모 화면 표시
        console.log('✅ 회원가입 성공! user:', result.user)
        console.log('🔄 화면 전환 대기 중...')
        
        // 로딩 상태는 register 함수에서 처리하지만, 여기서도 명시적으로 처리
        setLoading(false)
        
        // user state 업데이트 확인을 위한 짧은 지연
        // 실제로는 React의 state 업데이트가 비동기이므로 즉시 반영됨
        // 하지만 디버깅을 위해 확인
      }
    } catch (err) {
      console.error('❌ 회원가입 예외:', err)
      setError(`예외 발생: ${err.message || '알 수 없는 오류가 발생했습니다'}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          회원가입
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
              사용자명
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="username"
            />
          </div>

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
              minLength={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="최소 6자 이상"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="비밀번호 재입력"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-rose-500 hover:text-rose-600 font-semibold"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup

