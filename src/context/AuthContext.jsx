import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_URL = 'http://localhost:3001/api'

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
      if (!token) return

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const response = await axios.get(`${API_URL}/auth/me`)
      setUser(response.data.user)
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password
      })

      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)

      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || '회원가입에 실패했습니다'
      }
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })

      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)

      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || '로그인에 실패했습니다'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    axios.defaults.headers.common['Authorization'] = ''
    setUser(null)
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

