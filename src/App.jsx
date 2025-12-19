import React, { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import Auth from './components/Auth'
import { getMemos, createMemo, updateMemo, deleteMemo } from './api/memos'
import './App.css'

function App() {
  const { user, loading, logout } = useAuth()
  const [memos, setMemos] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingMemos, setLoadingMemos] = useState(false)

  // 사용자가 로그인하면 메모 불러오기
  useEffect(() => {
    if (user) {
      fetchMemos()
    }
  }, [user])

  // 메모 불러오기
  const fetchMemos = async () => {
    setLoadingMemos(true)
    const result = await getMemos()
    if (result.success) {
      setMemos(result.memos)
    }
    setLoadingMemos(false)
  }

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-slate-500">로딩 중...</div>
      </div>
    )
  }

  // 로그인하지 않은 경우
  if (!user) {
    return <Auth />
  }

  // 새 메모 생성
  const handleNewMemo = async () => {
    const newMemo = {
      id: null,
      title: '',
      content: '',
      createdAt: new Date().toISOString()
    }
    setSearchQuery('')
    setMemos(prevMemos => [newMemo, ...prevMemos])
    setEditingId('new')
  }

  // 메모 수정 모드로 전환
  const handleEdit = (id) => {
    setEditingId(id)
  }

  // 메모 저장
  const handleSave = async (id, title, content) => {
    let result
    if (id === 'new' || !id) {
      // 새 메모 생성
      result = await createMemo(title, content)
      if (result.success) {
        setMemos(prevMemos => {
          const filtered = prevMemos.filter(m => m.id !== 'new' && m.id !== null)
          return [result.memo, ...filtered]
        })
      }
    } else {
      // 기존 메모 수정
      result = await updateMemo(id, title, content)
      if (result.success) {
        setMemos(prevMemos => 
          prevMemos.map(memo => 
            memo.id === id ? result.memo : memo
          )
        )
      }
    }
    setEditingId(null)
    if (!result.success) {
      alert(result.error || '저장에 실패했습니다')
    }
  }

  // 메모 삭제
  const handleDelete = async (id) => {
    if (id === 'new' || !id) {
      // 아직 저장되지 않은 메모
      setMemos(prevMemos => prevMemos.filter(memo => memo.id !== id))
      setEditingId(null)
      return
    }

    if (window.confirm('정말 삭제하시겠습니까?')) {
      const result = await deleteMemo(id)
      if (result.success) {
        setMemos(prevMemos => prevMemos.filter(memo => memo.id !== id))
        if (editingId === id) {
          setEditingId(null)
        }
      } else {
        alert(result.error || '삭제에 실패했습니다')
      }
    }
  }

  // 수정 취소
  const handleCancel = (id) => {
    if (id === 'new' || !id) {
      setMemos(prevMemos => prevMemos.filter(memo => memo.id !== id))
    }
    setEditingId(null)
  }

  // 검색 필터링
  const filteredMemos = memos.filter(memo => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    const memoTitle = (memo.title || '').toLowerCase()
    const memoContent = (memo.content || '').toLowerCase()
    return memoTitle.includes(query) || memoContent.includes(query)
  })

  return (
    <div className="min-h-screen bg-slate-100 py-6">
      <div className="max-w-5xl mx-auto px-4">
        <header className="bg-white/80 backdrop-blur rounded-2xl shadow-md mb-6 px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <span>📝</span>
              <span>메모 앱</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-slate-500">
                {user.username}님 안녕하세요!
              </p>
              <button
                onClick={logout}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
              >
                로그아웃
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full md:flex-row md:w-auto">
            <input
              type="text"
              placeholder="메모 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-3 py-2 rounded-lg border border-slate-300 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
            />
            <button
              onClick={handleNewMemo}
              className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold shadow-sm transition"
            >
              <span className="text-lg leading-none">＋</span>
              <span>새 메모</span>
            </button>
          </div>
        </header>

        <main className="memo-container">
          {loadingMemos ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 text-center py-14 text-slate-500 text-sm shadow-sm">
              메모를 불러오는 중...
            </div>
          ) : filteredMemos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 text-center py-14 text-slate-500 text-sm shadow-sm">
              {searchQuery ? '검색 결과가 없습니다.' : '메모가 없습니다. 새 메모를 만들어보세요!'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMemos.map(memo => (
                <MemoItem
                  key={memo.id || 'new'}
                  memo={memo}
                  isEditing={editingId === memo.id || editingId === 'new'}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// 메모 아이템 컴포넌트
function MemoItem({ memo, isEditing, onEdit, onSave, onCancel, onDelete }) {
  const [title, setTitle] = useState(memo.title || '')
  const [content, setContent] = useState(memo.content || '')

  // 수정 모드로 전환될 때 현재 값으로 초기화
  React.useEffect(() => {
    if (isEditing) {
      setTitle(memo.title || '')
      setContent(memo.content || '')
    }
  }, [isEditing, memo.title, memo.content])

  const handleSaveClick = () => {
    onSave(memo.id, title, content)
  }

  const handleCancelClick = () => {
    setTitle(memo.title || '')
    setContent(memo.content || '')
    onCancel(memo.id)
  }

  if (isEditing) {
    return (
      <div className="memo-card editing bg-white rounded-2xl shadow-md border-2 border-emerald-400 h-full">
        <div className="flex flex-col gap-3 p-4">
          <input
            type="text"
            placeholder="제목을 입력하세요..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            autoFocus
          />
          <textarea
            placeholder="내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm leading-relaxed min-h-[160px] resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSaveClick}
              className="w-full inline-flex items-center justify-center px-3 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold shadow-sm transition"
            >
              💾 저장
            </button>
            <button
              onClick={handleCancelClick}
              className="w-full inline-flex items-center justify-center px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold transition"
            >
              ✖ 취소
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="memo-card bg-white rounded-2xl shadow-md h-full transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-col gap-2 p-4 h-full">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-800 truncate">
            {memo.title || '제목 없음'}
          </h3>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
            {memo.created_at ? new Date(memo.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : ''}
          </span>
        </div>
        <div className="memo-content-preview flex-1 text-xs text-slate-600 leading-relaxed mt-1">
          {memo.content || <span className="italic text-slate-400">내용이 없습니다.</span>}
        </div>
        <div className="flex gap-2 pt-2 mt-1 border-t border-slate-100">
          <button
            onClick={() => onEdit(memo.id)}
            className="w-full inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-rose-500 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition"
          >
            수정
          </button>
          <button
            onClick={() => onDelete(memo.id)}
            className="w-full inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-rose-500 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
