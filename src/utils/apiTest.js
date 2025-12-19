// API 연결 테스트 유틸리티
import axios from 'axios'
import { API_URL } from '../config/api.js'

export const testApiConnection = async () => {
  // API URL이 설정되지 않았으면 테스트 불가
  if (!API_URL || API_URL === '') {
    return {
      success: false,
      error: 'API URL이 설정되지 않았습니다. Vercel 환경 변수에 VITE_API_URL을 설정해주세요.'
    }
  }

  try {
    console.log('🔍 API 연결 테스트 시작...')
    console.log('📍 API URL:', API_URL)
    
    // API URL이 상대 경로(/api)인지 확인
    if (API_URL.startsWith('/')) {
      console.warn('⚠️ API URL이 상대 경로입니다. 백엔드가 별도 서버에 배포된 경우 절대 URL이 필요합니다.')
    }
    
    // 간단한 GET 요청으로 서버 상태 확인 (API URL의 루트)
    const rootUrl = API_URL.replace('/api', '') || API_URL
    console.log('🔗 테스트 URL:', rootUrl)
    
    const response = await axios.get(rootUrl, {
      timeout: 10000,
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

