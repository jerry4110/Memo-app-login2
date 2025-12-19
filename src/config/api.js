// API URL 설정
// 프로덕션: Vercel 환경 변수에서 가져옴
// 로컬 개발: localhost 사용

// Vite 환경 변수는 빌드 시에 주입됨
const getApiUrl = () => {
  // 1. 환경 변수에서 가져오기 (Vercel에서 설정한 값)
  if (import.meta.env.VITE_API_URL) {
    console.log('🔧 API URL (환경 변수):', import.meta.env.VITE_API_URL)
    return import.meta.env.VITE_API_URL
  }
  
  // 2. 개발 모드인지 확인
  if (import.meta.env.DEV) {
    console.log('🔧 API URL (개발 모드): http://localhost:3001/api')
    return 'http://localhost:3001/api'
  }
  
  // 3. 프로덕션 모드인데 환경 변수가 없으면 경고
  console.warn('⚠️ VITE_API_URL 환경 변수가 설정되지 않았습니다!')
  console.warn('⚠️ Vercel에서 Environment Variables에 VITE_API_URL을 설정해주세요.')
  
  // 임시로 상대 경로 시도 (백엔드가 같은 도메인에 있을 경우)
  // 하지만 일반적으로는 절대 URL이 필요합니다
  return '/api'
}

export const API_URL = getApiUrl()

// API URL이 올바른지 확인
console.log('🌐 최종 API URL:', API_URL)
