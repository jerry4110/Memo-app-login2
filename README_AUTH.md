# 인증 기능 가이드

메모 앱에 회원가입, 로그인, 로그아웃 기능이 추가되었습니다.

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 서버 및 클라이언트 실행

#### 방법 1: 동시 실행 (추천)
```bash
npm run dev:all
```

#### 방법 2: 별도 실행
```bash
# 터미널 1: 백엔드 서버 실행
npm run server

# 터미널 2: 프론트엔드 개발 서버 실행
npm run dev
```

### 3. 접속

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:3001

## 📋 기능

### 회원가입
- 사용자명, 이메일, 비밀번호 입력
- 비밀번호는 최소 6자 이상
- 중복 이메일/사용자명 확인
- 자동 로그인

### 로그인
- 이메일과 비밀번호로 로그인
- JWT 토큰 기반 인증
- 토큰은 localStorage에 저장

### 로그아웃
- 헤더의 로그아웃 버튼 클릭
- 토큰 삭제 및 세션 종료

### 메모 기능
- 로그인한 사용자만 메모 생성/수정/삭제 가능
- 각 사용자는 자신의 메모만 볼 수 있음
- 데이터베이스에 저장됨 (SQLite)

## 🗄️ 데이터베이스

### SQLite 데이터베이스
- 위치: `server/database.sqlite`
- 자동 생성됨 (처음 실행 시)

### 테이블 구조

#### users 테이블
- id: INTEGER (Primary Key)
- username: TEXT (Unique)
- email: TEXT (Unique)
- password: TEXT (Hashed)
- created_at: DATETIME

#### memos 테이블
- id: INTEGER (Primary Key)
- user_id: INTEGER (Foreign Key)
- title: TEXT
- content: TEXT
- created_at: DATETIME
- updated_at: DATETIME

## 🔐 보안

- 비밀번호는 bcrypt로 해싱되어 저장
- JWT 토큰으로 인증 관리
- 토큰 만료 시간: 7일
- API 요청 시 Bearer 토큰 필요

## 📁 프로젝트 구조

```
server/
├── server.js          # Express 서버
├── db/
│   └── database.js    # SQLite 데이터베이스 설정
└── routes/
    ├── auth.js        # 인증 라우트 (회원가입, 로그인)
    └── memos.js       # 메모 라우트 (CRUD)

src/
├── context/
│   └── AuthContext.jsx    # 인증 컨텍스트
├── components/
│   ├── Auth.jsx           # 인증 페이지
│   ├── Login.jsx          # 로그인 컴포넌트
│   └── Signup.jsx         # 회원가입 컴포넌트
├── api/
│   └── memos.js           # 메모 API 함수
└── App.jsx                # 메인 앱 컴포넌트
```

## 🛠️ API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보 (인증 필요)

### 메모 (인증 필요)
- `GET /api/memos` - 메모 목록 조회
- `POST /api/memos` - 메모 생성
- `PUT /api/memos/:id` - 메모 수정
- `DELETE /api/memos/:id` - 메모 삭제

## ⚠️ 주의사항

1. `.env` 파일에 `JWT_SECRET`을 설정하세요 (프로덕션 환경)
2. `server/database.sqlite`는 `.gitignore`에 포함되어 있습니다
3. 개발 환경에서는 기본 JWT_SECRET이 사용됩니다

## 🐛 문제 해결

### 서버가 시작되지 않는 경우
- 포트 3001이 사용 중인지 확인
- `npm install`로 모든 의존성이 설치되었는지 확인

### 로그인이 안 되는 경우
- 백엔드 서버가 실행 중인지 확인
- 브라우저 콘솔에서 오류 확인
- CORS 설정 확인

### 데이터베이스 오류
- `server/database.sqlite` 파일 삭제 후 재시작 (데이터 초기화)

