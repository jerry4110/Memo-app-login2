import axios from 'axios'

const API_URL = 'http://localhost:3001/api/memos'

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
  }
})

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getMemos = async () => {
  try {
    const response = await api.get('/')
    return { success: true, memos: response.data.memos }
  } catch (error) {
    console.error('메모 조회 오류:', error)
    return { success: false, error: error.response?.data?.error || '메모를 불러올 수 없습니다' }
  }
}

export const createMemo = async (title, content) => {
  try {
    const response = await api.post('/', { title, content })
    return { success: true, memo: response.data.memo }
  } catch (error) {
    console.error('메모 생성 오류:', error)
    return { success: false, error: error.response?.data?.error || '메모를 생성할 수 없습니다' }
  }
}

export const updateMemo = async (id, title, content) => {
  try {
    const response = await api.put(`/${id}`, { title, content })
    return { success: true, memo: response.data.memo }
  } catch (error) {
    console.error('메모 수정 오류:', error)
    return { success: false, error: error.response?.data?.error || '메모를 수정할 수 없습니다' }
  }
}

export const deleteMemo = async (id) => {
  try {
    await api.delete(`/${id}`)
    return { success: true }
  } catch (error) {
    console.error('메모 삭제 오류:', error)
    return { success: false, error: error.response?.data?.error || '메모를 삭제할 수 없습니다' }
  }
}

