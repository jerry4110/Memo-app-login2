# 🚀 GitHub 저장소 생성 및 업로드 가이드

## 방법 1: 자동 스크립트 사용 (가장 쉬움 ⭐)

### 1단계: GitHub에서 저장소 생성

1. **브라우저에서 GitHub 접속**
   - https://github.com/new 접속
   - 로그인이 필요하면 로그인

2. **저장소 생성**
   - **Repository name**: `Memo-app` 입력
   - **Description** (선택): "React + Vite 메모 앱"
   - **Public** 또는 **Private** 선택
   - ⚠️ **중요**: 아래 옵션들은 모두 **체크 해제**:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
   - **Create repository** 버튼 클릭

### 2단계: 스크립트 실행

PowerShell에서 다음 명령어 실행:

```powershell
.\upload-to-github.ps1
```

또는 더블클릭으로 실행:

```batch
upload-to-github.bat
```

스크립트가 자동으로:
- ✅ 원격 저장소 연결
- ✅ 코드 업로드
- ✅ 완료 확인

---

## 방법 2: 수동 명령어 사용

### 1단계: GitHub에서 저장소 생성

위의 "1단계"와 동일

### 2단계: 터미널에서 명령어 실행

```bash
# 원격 저장소 연결
git remote add origin https://github.com/jerry4110/Memo-app.git

# 코드 업로드
git push -u origin main
```

### 인증 문제 발생 시

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" 클릭
3. Note: `memo-app-upload` 입력
4. 권한 선택: `repo` 체크
5. "Generate token" 클릭
6. 토큰 복사 (한 번만 보여줌!)
7. 푸시할 때 비밀번호 대신 **토큰 입력**

---

## 🎯 빠른 체크리스트

- [ ] GitHub에서 `Memo-app` 저장소 생성 완료
- [ ] README, .gitignore, license 체크 해제했는지 확인
- [ ] 스크립트 실행 또는 수동 명령어 실행
- [ ] 업로드 성공 확인

---

## 📋 저장소 정보

- **저장소 이름**: `Memo-app`
- **GitHub 사용자**: `jerry4110`
- **저장소 URL**: `https://github.com/jerry4110/Memo-app`
- **로컬 브랜치**: `main`
- **커밋 상태**: ✅ 완료 (147개 파일, 12,979줄)

---

## 🆘 문제 해결

### "remote origin already exists" 오류
```bash
git remote remove origin
git remote add origin https://github.com/jerry4110/Memo-app.git
```

### 인증 오류
- Personal Access Token 생성 및 사용
- GitHub Desktop 사용 고려

### 저장소가 보이지 않음
- 브라우저에서 저장소 URL 확인: https://github.com/jerry4110/Memo-app
- Private 저장소인 경우 본인만 볼 수 있음

---

**준비 완료!** 위 단계를 따라하면 코드가 GitHub에 업로드됩니다! 🎉



