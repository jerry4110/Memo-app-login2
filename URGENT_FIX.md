# 🚨 긴급 수정 필요: API URL 설정

## 발견된 문제

브라우저 콘솔 확인 결과:
```
⚠️ VITE_API_URL 환경 변수가 설정되지 않았습니다!
🌐 최종 API URL: /api
```

**문제:**
- API URL이 `/api` (상대 경로)로 설정됨
- 이는 Vercel의 프론트엔드로 요청이 가게 만듦
- 실제 백엔드 서버로 요청이 가지 않음
- 회원가입/로그인이 작동하지 않음

---

## 🔧 즉시 해결 방법

### Vercel 환경 변수 설정 (5분)

1. **Vercel Dashboard 접속**
   - https://vercel.com/dashboard
   - `Memo-app-login` 또는 `Memo-app-login2` 프로젝트 선택

2. **환경 변수 설정**
   - Settings → Environment Variables
   - "Add New" 클릭
   - 다음 값 입력:
     ```
     Key: VITE_API_URL
     Value: https://your-backend-url.onrender.com/api
     ```
     ⚠️ **주의:** `your-backend-url.onrender.com`을 실제 Render 백엔드 URL로 변경!

3. **환경 선택**
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
   - 모두 체크!

4. **저장 및 재배포**
   - Save 클릭
   - Deployments → 최신 배포 → "..." → "Redeploy"

---

## 백엔드 서버 URL 확인 방법

### Render 사용 중인 경우:
1. Render Dashboard 접속
2. Web Service 선택
3. URL 확인 (예: `https://memo-app-backend.onrender.com`)
4. 이 URL + `/api`를 환경 변수 값으로 사용

### 예시:
```
VITE_API_URL = https://memo-app-backend.onrender.com/api
```

---

## 수정 완료된 사항

코드에서 다음을 개선했습니다:

1. ✅ API URL이 없을 때 명확한 오류 메시지
2. ✅ 사용자에게 알림 표시
3. ✅ API 연결 테스트 개선
4. ✅ 상대 경로 사용 시 경고

---

## 확인 방법

환경 변수 설정 후:

1. Vercel에서 재배포
2. 브라우저에서 사이트 접속
3. F12 → Console 확인
4. 다음 메시지 확인:
   ```
   ✅ API URL (환경 변수): https://xxx.onrender.com/api
   🌐 최종 API URL: https://xxx.onrender.com/api
   ```

이제 회원가입이 정상 작동합니다!

