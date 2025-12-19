import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDB, dbGet, dbRun } from '../db/database.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // 입력 검증
    if (!username || !email || !password) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '비밀번호는 최소 6자 이상이어야 합니다' })
    }

    const db = getDB()

    // 중복 확인
    const existingUser = await dbGet(
      db,
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    )

    if (existingUser) {
      return res.status(400).json({ error: '이미 존재하는 사용자명 또는 이메일입니다' })
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 생성
    const result = await dbRun(
      db,
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    )

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: result.id, username, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: '회원가입이 완료되었습니다',
      token,
      user: {
        id: result.id,
        username,
        email
      }
    })
  } catch (error) {
    console.error('회원가입 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // 입력 검증
    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요' })
    }

    const db = getDB()

    // 사용자 조회
    const user = await dbGet(
      db,
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' })
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' })
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('로그인 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

// 토큰 검증 미들웨어
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: '인증 토큰이 필요합니다' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '유효하지 않은 토큰입니다' })
    }
    req.user = user
    next()
  })
}

// 사용자 정보 조회 (토큰 검증)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const db = getDB()
    const user = await dbGet(
      db,
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    )

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다' })
    }

    res.json({ user })
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

export default router

