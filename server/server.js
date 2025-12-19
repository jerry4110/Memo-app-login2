import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import memoRoutes from './routes/memos.js'
import { initDB } from './db/database.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 미들웨어
// CORS 설정 - 모든 Vercel 프리뷰 URL 허용
app.use(cors({
  origin: function (origin, callback) {
    // origin이 없는 경우 (같은 도메인에서 요청하거나 Postman 등)
    if (!origin) return callback(null, true)
    
    // 허용된 origin 목록
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174'
    ]
    
    // Vercel 도메인 체크 (모든 서브도메인 포함)
    if (origin.includes('vercel.app') || origin.includes('localhost')) {
      return callback(null, true)
    }
    
    // 허용된 목록에 있으면 통과
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    
    // 그 외에는 거부 (프로덕션에서는 더 엄격하게 설정 가능)
    console.log('⚠️ CORS 차단된 origin:', origin)
    callback(null, true) // 개발 단계에서는 모두 허용
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// 데이터베이스 초기화
initDB()

// 라우트
app.use('/api/auth', authRoutes)
app.use('/api/memos', memoRoutes)

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Memo App API Server' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

