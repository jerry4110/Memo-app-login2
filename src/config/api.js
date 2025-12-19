// API URL 설정
// 프로덕션: Vercel 환경 변수에서 가져옴
// 로컬 개발: localhost 사용

// Vite 환경 변수는 빌드 시에 주입됨
const getApiUrl = () => {
  // 1. 환경 변수에서 가져오기 (Vercel에서 설정한 값)
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL
    console.log('✅ API URL (환경 변수):', url)
    return url
  }
  
  // 2. 개발 모드인지 확인
  if (import.meta.env.DEV) {
    const url = 'http://localhost:3001/api'
    console.log('✅ API URL (개발 모드):', url)
    return url
  }
  
  // 3. 프로덕션 모드인데 환경 변수가 없으면 경고만 표시 (alert 제거)
  const errorMsg = `
    ⚠️ 중요: API URL이 설정되지 않았습니다!
    
    Vercel Dashboard에서 다음을 설정해주세요:
    1. Settings → Environment Variables
    2. Key: VITE_API_URL
    3. Value: https://your-backend.onrender.com/api
    4. Production, Preview, Development 모두 체크
    5. 저장 후 재배포
    
    현재 프로덕션 환경에서는 API 요청이 작동하지 않습니다.
  `
  console.warn(errorMsg)
  
  // 상대 경로는 작동하지 않으므로 빈 문자열 반환
  // Auth 컴포넌트에서 이미 경고 메시지를 표시하므로 alert는 제거
  return ''
}

export const API_URL = getApiUrl()

// API URL이 올바른지 확인
if (API_URL) {
  console.log('🌐 최종 API URL:', API_URL)
} else {
  console.error('❌ API URL이 설정되지 않아 API 요청이 작동하지 않습니다!')
}
