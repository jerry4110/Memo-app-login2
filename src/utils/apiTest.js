// API 연결 테스트 유틸리티
import axios from 'axios'
import { API_URL } from '../config/api.js'

export const testApiConnection = async () => {
  try {
    console.log('🔍 API 연결 테스트 시작...')
    console.log('📍 API URL:', API_URL)
    
    // 간단한 GET 요청으로 서버 상태 확인
    const response = await axios.get(`${API_URL.replace('/api', '')}`, {
      timeout: 5000,
      validateStatus: () => true // 모든 상태 코드 허용
    })
    
    console.log('✅ API 서버 응답:', {
      status: response.status,
      data: response.data
    })
    
    return {
      success: true,
      status: response.status,
      message: 'API 서버에 연결되었습니다'
    }
  } catch (error) {
    console.error('❌ API 연결 테스트 실패:', error)
    
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      return {
        success: false,
        error: `API 서버에 연결할 수 없습니다.\n\nAPI URL: ${API_URL}\n\n백엔드 서버가 배포되어 있는지 확인해주세요.`
      }
    }
    
    return {
      success: false,
      error: error.message || 'API 연결 테스트 실패'
    }
  }
}

