# GitHub 업로드 스크립트
# 사용법: PowerShell에서 .\upload-to-github.ps1 실행

Write-Host "🚀 GitHub 업로드 시작..." -ForegroundColor Cyan

# 저장소 이름 설정
$repoName = "Memo-app"
$githubUsername = "jerry4110"
$repoUrl = "https://github.com/$githubUsername/$repoName.git"

Write-Host "`n📋 저장소 정보:" -ForegroundColor Yellow
Write-Host "   저장소 이름: $repoName"
Write-Host "   GitHub 사용자: $githubUsername"
Write-Host "   저장소 URL: $repoUrl"

Write-Host "`n⏳ GitHub 저장소 생성 확인 중..." -ForegroundColor Yellow
Write-Host "   만약 아직 저장소를 만들지 않으셨다면:" -ForegroundColor White
Write-Host "   1. https://github.com/new 접속" -ForegroundColor White
Write-Host "   2. Repository name: $repoName 입력" -ForegroundColor White
Write-Host "   3. Public 또는 Private 선택" -ForegroundColor White
Write-Host "   4. README, .gitignore, license 모두 체크 해제" -ForegroundColor White
Write-Host "   5. Create repository 클릭" -ForegroundColor White

$continue = Read-Host "`n저장소를 만들었나요? (Y/N)"

if ($continue -ne "Y" -and $continue -ne "y") {
    Write-Host "`n❌ 저장소를 먼저 생성해주세요." -ForegroundColor Red
    exit
}

Write-Host "`n🔗 원격 저장소 연결 중..." -ForegroundColor Cyan

# 기존 원격 저장소가 있으면 제거
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "   기존 원격 저장소 제거 중..." -ForegroundColor Yellow
    git remote remove origin
}

# 원격 저장소 추가
git remote add origin $repoUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ 원격 저장소 연결 완료" -ForegroundColor Green
} else {
    Write-Host "   ❌ 원격 저장소 연결 실패" -ForegroundColor Red
    exit
}

Write-Host "`n📤 코드 업로드 중..." -ForegroundColor Cyan

# 브랜치 확인 및 설정
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "   브랜치를 main으로 변경 중..." -ForegroundColor Yellow
    git branch -M main
}

# 푸시
Write-Host "   GitHub에 푸시 중..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ 업로드 완료!" -ForegroundColor Green
    Write-Host "`n🌐 저장소 주소: $repoUrl" -ForegroundColor Cyan
    Write-Host "`n🎉 축하합니다! 코드가 GitHub에 업로드되었습니다." -ForegroundColor Green
} else {
    Write-Host "`n❌ 업로드 실패" -ForegroundColor Red
    Write-Host "`n가능한 원인:" -ForegroundColor Yellow
    Write-Host "   1. 저장소가 아직 생성되지 않았습니다" -ForegroundColor White
    Write-Host "   2. 인증이 필요합니다 (Personal Access Token)" -ForegroundColor White
    Write-Host "   3. 저장소 이름이 일치하지 않습니다" -ForegroundColor White
    Write-Host "`n인증이 필요한 경우:" -ForegroundColor Yellow
    Write-Host "   - GitHub → Settings → Developer settings → Personal access tokens" -ForegroundColor White
    Write-Host "   - Generate new token (classic) → repo 권한 체크" -ForegroundColor White
    Write-Host "   - 토큰 생성 후 비밀번호 입력란에 토큰 입력" -ForegroundColor White
}



