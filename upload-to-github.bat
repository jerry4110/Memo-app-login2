@echo off
chcp 65001 >nul
echo 🚀 GitHub 업로드 시작...
echo.

set REPO_NAME=Memo-app
set GITHUB_USER=jerry4110
set REPO_URL=https://github.com/%GITHUB_USER%/%REPO_NAME%.git

echo 📋 저장소 정보:
echo    저장소 이름: %REPO_NAME%
echo    GitHub 사용자: %GITHUB_USER%
echo    저장소 URL: %REPO_URL%
echo.

echo ⏳ GitHub 저장소 생성 확인 중...
echo    만약 아직 저장소를 만들지 않으셨다면:
echo    1. https://github.com/new 접속
echo    2. Repository name: %REPO_NAME% 입력
echo    3. Public 또는 Private 선택
echo    4. README, .gitignore, license 모두 체크 해제
echo    5. Create repository 클릭
echo.

set /p CONTINUE="저장소를 만들었나요? (Y/N): "

if /i not "%CONTINUE%"=="Y" (
    echo.
    echo ❌ 저장소를 먼저 생성해주세요.
    pause
    exit /b
)

echo.
echo 🔗 원격 저장소 연결 중...

git remote remove origin 2>nul
git remote add origin %REPO_URL%

if %errorlevel% equ 0 (
    echo    ✅ 원격 저장소 연결 완료
) else (
    echo    ❌ 원격 저장소 연결 실패
    pause
    exit /b
)

echo.
echo 📤 코드 업로드 중...

git branch -M main 2>nul
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ 업로드 완료!
    echo.
    echo 🌐 저장소 주소: %REPO_URL%
    echo.
    echo 🎉 축하합니다! 코드가 GitHub에 업로드되었습니다.
) else (
    echo.
    echo ❌ 업로드 실패
    echo.
    echo 가능한 원인:
    echo    1. 저장소가 아직 생성되지 않았습니다
    echo    2. 인증이 필요합니다 (Personal Access Token)
    echo    3. 저장소 이름이 일치하지 않습니다
    echo.
    echo 인증이 필요한 경우:
    echo    - GitHub → Settings → Developer settings → Personal access tokens
    echo    - Generate new token (classic) → repo 권한 체크
    echo    - 토큰 생성 후 비밀번호 입력란에 토큰 입력
)

echo.
pause



