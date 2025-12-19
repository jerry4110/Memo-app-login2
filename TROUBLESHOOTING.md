# 🔧 문제 해결 가이드

## 회원가입 후 메모 화면으로 넘어가지 않는 문제

### 1️⃣ API URL 확인

**확인 방법:**
1. 브라우저 개발자 도구(F12) 열기
2. Console 탭 확인
3. "최종 API URL:" 또는 "API URL (환경 변수):" 메시지 찾기

**문제:**
- API URL이 `/api`로 표시됨 → 환경 변수가 설정되지 않음
- API URL이 `http://localhost:3001/api`로 표시됨 → 프로덕션에서도 로컬 주소 사용

**해결:**
1. Vercel Dashboard → 프로젝트 → Settings → Environment Variables
2. `VITE_API_URL` 추가
3. 값: `https://your-backend-url.onrender.com/api`
4. Production, Preview, Development 모두 체크
5. 저장 후 재배포

---

### 2️⃣ 백엔드 서버 상태 확인

**확인 방법:**
1. Render/Railway 대시보드 접속
2. 서버 상태 확인 (Running이어야 함)
3. 로그 확인 (에러 메시지 확인)

**테스트:**
브라우저에서 직접 접속:
```
https://your-backend-url.onrender.com
```

"Memo App API Server" 메시지가 보이면 정상

**문제:**
- 서버가 Sleep 상태 → 첫 요청 시 30초 지연 가능
- 서버가 실행되지 않음 → Render에서 서버 시작 필요

---

### 3️⃣ 브라우저 콘솔 에러 확인

**확인 방법:**
1. 브라우저 개발자 도구(F12)
2. Console 탭
3. 회원가입 시도 후 에러 메시지 확인

**일반적인 에러:**

#### "Network Error" 또는 "ERR_NETWORK"
- **원인:** API 서버에 연결할 수 없음
- **해결:**
  1. 백엔드 서버가 배포되어 있는지 확인
  2. API URL이 올바른지 확인
  3. CORS 설정 확인

#### "Request timeout"
- **원인:** 서버 응답이 너무 느림
- **해결:**
  1. Render 서버가 Sleep 상태일 수 있음
  2. 첫 요청은 30초 정도 걸릴 수 있음
  3. UptimeRobot으로 서버 유지

#### "CORS policy" 오류
- **원인:** CORS 설정 문제
- **해결:** `server/server.js`에서 CORS 설정 확인

#### "404 Not Found"
- **원인:** API 경로가 잘못됨
- **해결:** API URL 끝에 `/api`가 포함되어야 함

---

## 빠른 진단 체크리스트

- [ ] Vercel Environment Variables에 `VITE_API_URL` 설정됨
- [ ] 백엔드 서버가 Render/Railway에 배포됨
- [ ] 백엔드 서버 상태가 "Running"
- [ ] API URL이 올바름 (예: `https://xxx.onrender.com/api`)
- [ ] 브라우저 콘솔에서 API URL이 올바르게 표시됨
- [ ] Network 탭에서 API 요청이 전송됨
- [ ] API 응답 상태 코드가 200 또는 201

---

## 단계별 디버깅

### Step 1: API URL 확인
```javascript
// 브라우저 콘솔에서 실행
console.log('API URL:', import.meta.env.VITE_API_URL)
```

### Step 2: API 연결 테스트
```javascript
// 브라우저 콘솔에서 실행
fetch('YOUR_API_URL')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### Step 3: 회원가입 요청 테스트
브라우저 개발자 도구 → Network 탭 → 회원가입 시도 → `/auth/register` 요청 확인

---

## 연락처

문제가 계속되면:
1. 브라우저 콘솔 스크린샷
2. Network 탭 스크린샷
3. 에러 메시지 전체 내용

이 정보와 함께 문의해주세요.

