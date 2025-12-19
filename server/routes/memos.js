import express from 'express'
import { getDB, dbGet, dbAll, dbRun } from '../db/database.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken)

// 사용자의 모든 메모 조회
router.get('/', async (req, res) => {
  try {
    const db = getDB()
    const memos = await dbAll(
      db,
      'SELECT * FROM memos WHERE user_id = ? ORDER BY updated_at DESC',
      [req.user.id]
    )

    res.json({ memos })
  } catch (error) {
    console.error('메모 조회 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

// 메모 생성
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body
    const db = getDB()

    const result = await dbRun(
      db,
      'INSERT INTO memos (user_id, title, content) VALUES (?, ?, ?)',
      [req.user.id, title || '', content || '']
    )

    const memo = await dbGet(
      db,
      'SELECT * FROM memos WHERE id = ?',
      [result.id]
    )

    res.status(201).json({ message: '메모가 생성되었습니다', memo })
  } catch (error) {
    console.error('메모 생성 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

// 메모 수정
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, content } = req.body
    const db = getDB()

    // 메모 소유권 확인
    const memo = await dbGet(
      db,
      'SELECT * FROM memos WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    )

    if (!memo) {
      return res.status(404).json({ error: '메모를 찾을 수 없습니다' })
    }

    await dbRun(
      db,
      'UPDATE memos SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [title || '', content || '', id, req.user.id]
    )

    const updatedMemo = await dbGet(
      db,
      'SELECT * FROM memos WHERE id = ?',
      [id]
    )

    res.json({ message: '메모가 수정되었습니다', memo: updatedMemo })
  } catch (error) {
    console.error('메모 수정 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

// 메모 삭제
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const db = getDB()

    // 메모 소유권 확인
    const memo = await dbGet(
      db,
      'SELECT * FROM memos WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    )

    if (!memo) {
      return res.status(404).json({ error: '메모를 찾을 수 없습니다' })
    }

    await dbRun(
      db,
      'DELETE FROM memos WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    )

    res.json({ message: '메모가 삭제되었습니다' })
  } catch (error) {
    console.error('메모 삭제 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

export default router

