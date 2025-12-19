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
app.use(cors())
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

