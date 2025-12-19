# 🔧 Vercel 환경 변수 설정 가이드

## 📋 사전 준비

### 1단계: 백엔드 서버 URL 확인

먼저 백엔드 서버가 배포되어 있는지 확인해야 합니다.

**Render를 사용하는 경우:**
1. https://render.com 접속
2. Dashboard → Services 확인
3. Web Service 이름 클릭
4. "URL" 확인 (예: `https://memo-app-backend.onrender.com`)

**Railway를 사용하는 경우:**
1. https://railway.app 접속
2. 프로젝트 선택
3. Service → Settings → Domains 확인

**백엔드 서버가 없다면:**
- `DEPLOY_BACKEND.md` 파일을 참고하여 먼저 백엔드를 배포해야 합니다.

---

## 🔐 Vercel 환경 변수 설정 (단계별)

### 2단계: Vercel Dashboard 접속

1. 브라우저에서 https://vercel.com/dashboard 접속
2. GitHub 계정으로 로그인 (또는 다른 방법)

### 3단계: 프로젝트 선택

1. Dashboard에서 `Memo-app-login` 또는 `Memo-app-login2` 프로젝트 찾기
2. 프로젝트 클릭

### 4단계: Settings 열기

1. 프로젝트 페이지 상단 메뉴에서 **"Settings"** 클릭
2. 왼쪽 사이드바에서 **"Environment Variables"** 클릭

### 5단계: 환경 변수 추가

1. **"Add New"** 또는 **"Add"** 버튼 클릭
2. 다음 정보 입력:

   **Key:**
   ```
   VITE_API_URL
   ```

   **Value:**
   ```
   https://your-backend-url.onrender.com/api
   ```
   ⚠️ `your-backend-url.onrender.com`을 실제 백엔드 서버 URL로 변경!

   **Environment:**
   - ✅ **Production** (체크)
   - ✅ **Preview** (체크)
   - ✅ **Development** (체크)
   
   모두 체크하는 것을 권장합니다.

3. **"Save"** 버튼 클릭

### 6단계: 재배포

환경 변수를 추가한 후 **반드시 재배포**해야 합니다:

**방법 1: 자동 재배포**
- 환경 변수 저장 후 자동으로 재배포가 시작될 수 있습니다

**방법 2: 수동 재배포**
1. 프로젝트 페이지 상단의 **"Deployments"** 탭 클릭
2. 최신 배포 항목의 **"..."** (점 3개) 메뉴 클릭
3. **"Redeploy"** 선택
4. 확인

---

## ✅ 확인 방법

### 배포 완료 후:

1. 배포된 사이트 접속 (예: `https://memo-app-login.vercel.app`)
2. 브라우저 개발자 도구(F12) 열기
3. **Console** 탭 확인
4. 다음 메시지 확인:

**정상:**
```
✅ API URL (환경 변수): https://xxx.onrender.com/api
🌐 최종 API URL: https://xxx.onrender.com/api
```

**오류:**
```
⚠️ VITE_API_URL 환경 변수가 설정되지 않았습니다!
```
→ 환경 변수가 제대로 설정되지 않았거나 재배포가 필요합니다.

---

## 🚨 문제 해결

### 문제 1: 환경 변수가 적용되지 않음
- **원인:** 재배포를 하지 않음
- **해결:** Deployments → Redeploy

### 문제 2: 백엔드 서버 URL을 모름
- **원인:** 백엔드가 배포되지 않았거나 URL을 찾지 못함
- **해결:** Render/Railway Dashboard에서 서버 URL 확인

### 문제 3: CORS 오류
- **원인:** 백엔드 CORS 설정 문제
- **해결:** `server/server.js`에서 CORS 설정 확인

---

## 📝 예시

### 백엔드 서버 URL이 `https://memo-app-backend.onrender.com`인 경우:

**Key:** `VITE_API_URL`  
**Value:** `https://memo-app-backend.onrender.com/api`

⚠️ **주의:** 끝에 `/api`를 반드시 포함해야 합니다!

---

## 🎯 빠른 참조

- **환경 변수 이름:** `VITE_API_URL`
- **형식:** `https://서버주소.onrender.com/api`
- **필수 단계:** 재배포!

