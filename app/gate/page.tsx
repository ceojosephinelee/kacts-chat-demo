'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function GatePage() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const pw = password.trim()
    if (!pw) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })

      if (res.ok) {
        window.location.href = redirect
      } else {
        const data = await res.json()
        setError(data.error || '비밀번호가 올바르지 않습니다.')
      }
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: 'var(--body)',
        background: 'var(--saphia-bg, #fff)',
      }}
    >
      <img
        src="/saphihugh_symbol.png"
        alt="SAPHIHUGH"
        style={{ width: 84, height: 'auto', marginBottom: 22 }}
      />

      <div style={{
        fontFamily: 'var(--body)',
        fontWeight: 800,
        fontSize: 26,
        letterSpacing: 1,
        color: 'var(--navy, #1b2c56)',
      }}>
        SAPHIHUGH
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-soft, #707887)', margin: '10px 0 28px' }}>
        초대된 사용자만 이용할 수 있습니다.
      </div>

      <div style={{ width: '100%', maxWidth: 440 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: '1.6px solid var(--navy, #1b2c56)',
            borderRadius: 999,
            padding: '9px 9px 9px 28px',
            background: '#fff',
          }}
          className="focus-within:!border-[#1b2c56]"
        >
          <input
            type="password"
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              fontSize: 16,
              fontFamily: 'var(--body)',
              background: 'transparent',
              padding: '14px 0',
              color: 'var(--ink, #1c2230)',
            }}
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={handleKeyUp}
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'var(--navy, #1b2c56)',
              color: '#fff',
              border: 'none',
              display: 'grid',
              placeItems: 'center',
              cursor: loading ? 'wait' : 'pointer',
              flexShrink: 0,
              fontSize: 20,
              opacity: loading ? 0.6 : 1,
            }}
            aria-label="Submit"
          >
            →
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13, color: '#dc2626' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}