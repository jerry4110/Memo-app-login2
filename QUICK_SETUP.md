# ⚡ 빠른 설정 가이드 - Vercel 환경 변수

## 🎯 5분 안에 완료하기

### Step 1: 백엔드 서버 URL 확인 (1분)

**Render 사용 중이라면:**
1. https://dashboard.render.com 접속
2. Web Services에서 서버 찾기
3. 서버 클릭 → URL 확인 (예: `https://memo-app-backend.onrender.com`)

**백엔드가 없다면:**
- `DEPLOY_BACKEND.md` 파일을 먼저 따라 백엔드를 배포하세요.

---

### Step 2: Vercel 환경 변수 설정 (3분)

1. **Vercel 접속**
   - https://vercel.com/dashboard
   - GitHub로 로그인

2. **프로젝트 선택**
   - `Memo-app-login` 또는 `Memo-app-login2` 선택

3. **Settings 열기**
   - 상단 메뉴: **Settings**
   - 왼쪽 메뉴: **Environment Variables**

4. **환경 변수 추가**
   - **"Add New"** 버튼 클릭
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
     - ⚠️ `your-backend-url`을 실제 백엔드 URL로 변경!
   - **Environment**: 
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - **"Save"** 클릭

5. **재배포**
   - **Deployments** 탭 클릭
   - 최신 배포의 **"..."** → **"Redeploy"**
   - 배포 완료 대기 (약 1-2분)

---

### Step 3: 확인 (1분)

1. 배포된 사이트 접속
2. F12 → Console 탭
3. 다음 메시지 확인:

✅ **성공:**
```
✅ API URL (환경 변수): https://xxx.onrender.com/api
```

❌ **실패 (재시도 필요):**
```
⚠️ VITE_API_URL 환경 변수가 설정되지 않았습니다!
```

---

## 🆘 문제가 있다면?

### 백엔드 서버가 없어요
→ `DEPLOY_BACKEND.md` 파일 참고

### 환경 변수를 설정했는데 작동 안 해요
→ 재배포를 확인하세요 (중요!)

### 백엔드 URL을 모르겠어요
→ Render Dashboard에서 서버 URL 확인

---

## 📞 예시

백엔드가 `https://memo-app-backend.onrender.com`에 배포되어 있다면:

**Key:** `VITE_API_URL`  
**Value:** `https://memo-app-backend.onrender.com/api`

끝!

