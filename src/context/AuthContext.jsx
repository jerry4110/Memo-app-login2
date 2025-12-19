import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api.js'
import { logAPIError, logAPIResponse } from '../utils/debug.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 토큰을 localStorage에서 가져오기
  const getToken = () => {
    return localStorage.getItem('token')
  }

  // axios 기본 설정
  axios.defaults.headers.common['Authorization'] = getToken() 
    ? `Bearer ${getToken()}` 
    : ''

  // 초기 로드 시 사용자 정보 확인
  useEffect(() => {
    const token = getToken()
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const response = await axios.get(`${API_URL}/auth/me`)
      
      if (response.data && response.data.user) {
        setUser(response.data.user)
      } else {
        throw new Error('사용자 정보를 가져올 수 없습니다')
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error)
      localStorage.removeItem('token')
      axios.defaults.headers.common['Authorization'] = ''
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const register = async (username, email, password) => {
    try {
      const requestUrl = `${API_URL}/auth/register`
      console.log('📤 회원가입 요청 시작')
      console.log('📍 API URL:', requestUrl)
      console.log('📝 요청 데이터:', { username, email, password: '***' })
      
      const response = await axios.post(requestUrl, {
        username,
        email,
        password
      }, {
        timeout: 30000, // 30초 타임아웃
        validateStatus: function (status) {
          return status >= 200 && status < 500 // 400대 에러도 catch하도록
        }
      })

      console.log('📥 회원가입 응답:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      })

      if (response.status === 201 || response.status === 200) {
        if (response.data && response.data.token && response.data.user) {
          const { token, user } = response.data
          console.log('✅ 회원가입 성공!')
          console.log('👤 사용자 정보:', user)
          
          localStorage.setItem('token', token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // user state 업데이트 - 이게 화면 전환을 트리거함
          // 강제로 state 업데이트를 보장하기 위해 함수형 업데이트 사용
          setUser(() => {
            console.log('🔄 setUser 호출됨, 새로운 user:', user)
            return user
          })
          setLoading(false)

          // state 업데이트가 완료되었는지 확인
          setTimeout(() => {
            console.log('✅ User state 업데이트 완료 확인')
          }, 0)

          return { success: true, user }
        } else {
          console.error('❌ 응답 데이터 형식 오류:', response.data)
          return {
            success: false,
            error: `서버 응답 오류: 응답에 token 또는 user 정보가 없습니다. 응답: ${JSON.stringify(response.data)}`
          }
        }
      } else {
        console.error('❌ HTTP 오류:', response.status, response.data)
        return {
          success: false,
          error: response.data?.error || `서버 오류 (${response.status}): ${response.statusText}`
        }
      }
    } catch (error) {
      console.error('❌ 회원가입 예외 발생:', error)
      
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          error: '요청 시간이 초과되었습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
        }
      }
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return {
          success: false,
          error: `네트워크 오류: API 서버에 연결할 수 없습니다.\n\n확인사항:\n1. 백엔드 서버가 배포되어 있는지 확인\n2. API URL이 올바른지 확인: ${API_URL}\n3. 브라우저 콘솔(F12)에서 네트워크 탭 확인`
        }
      }

      logAPIError(error, '회원가입')
      
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message
        || error.message 
        || '회원가입에 실패했습니다'
      
      return {
        success: false,
        error: `${errorMessage}\n\n(상태 코드: ${error.response?.status || 'N/A'})`
      }
    }
  }

  const login = async (email, password) => {
    try {
      console.log('로그인 요청:', { email, API_URL: `${API_URL}/auth/login` })
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })

      logAPIResponse(response, '로그인')

      if (response.data && response.data.token && response.data.user) {
        const { token, user } = response.data
        console.log('✅ 로그인 성공, 사용자 정보:', user)
        
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // 강제로 state 업데이트
        setUser(() => {
          console.log('🔄 setUser 호출됨 (로그인), 새로운 user:', user)
          return user
        })
        setLoading(false)

        return { success: true, user }
      } else {
        console.error('로그인 응답 형식 오류:', response.data)
        return {
          success: false,
          error: '로그인 응답 형식이 올바르지 않습니다'
        }
      }
    } catch (error) {
      logAPIError(error, '로그인')
      return {
        success: false,
        error: error.response?.data?.error || error.message || '로그인에 실패했습니다'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    axios.defaults.headers.common['Authorization'] = ''
    setUser(null)
  }

  // value 객체를 useMemo로 최적화하여 불필요한 리렌더링 방지
  const value = React.useMemo(() => ({
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user
  }), [user, loading])

  // user 상태 변경 시 로그
  React.useEffect(() => {
    console.log('🔄 AuthContext user 상태 변경:', user ? `로그인됨 (${user.username || user.email})` : '로그아웃됨')
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

