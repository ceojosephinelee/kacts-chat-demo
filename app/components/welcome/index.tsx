'use client'
import type { FC } from 'react'
import React, { useRef, useState } from 'react'
import type { AppInfo, PromptConfig } from '@/types/app'

export interface IWelcomeProps {
  conversationName: string
  hasSetInputs: boolean
  isPublicVersion: boolean
  siteInfo: AppInfo
  promptConfig: PromptConfig
  onStartChat: (inputs: Record<string, any>) => void
  canEditInputs: boolean
  savedInputs: Record<string, any>
  onInputsChange: (inputs: Record<string, any>) => void
  onSendFirstMessage?: (message: string) => void
}

const Welcome: FC<IWelcomeProps> = ({
  hasSetInputs,
  onSendFirstMessage,
}) => {
  const [query, setQuery] = useState('')
  const queryRef = useRef('')
  const isUseInputMethod = useRef(false)

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    queryRef.current = e.target.value
  }

  const handleSend = () => {
    const msg = queryRef.current.trim()
    if (!msg) return
    onSendFirstMessage?.(msg)
    setQuery('')
    queryRef.current = ''
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter' && !e.shiftKey && !isUseInputMethod.current) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
  }

  if (hasSetInputs) return null

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'var(--body)',
      }}
    >
      <div
        style={{
          fontSize: 27,
          fontWeight: 600,
          marginBottom: 36,
          color: 'var(--ink)',
          letterSpacing: -0.3,
        }}
      >
        안녕하세요. 오늘도 함께할까요?
      </div>

      <div style={{ width: '100%', maxWidth: 820 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: '1.8px solid #c9ced9',
            borderRadius: 999,
            padding: '9px 9px 9px 34px',
            background: 'var(--saphia-bg)',
          }}
          className="focus-within:!border-[#1b2c56]"
        >
          <input
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 18,
              fontFamily: 'var(--body)',
              background: 'transparent',
              padding: '19px 0',
              color: 'var(--ink)',
            }}
            placeholder="SAPHIA 에게 물어보기"
            value={query}
            onChange={handleContentChange}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'var(--navy)',
              color: '#fff',
              border: 'none',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              fontSize: 23,
            }}
            aria-label="Send"
          >
            ↑
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 30, maxWidth: 680 }}>
        <div style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
          학회의 연구와 학술 자료를 기반으로 필요한 지식을 찾고, 이해하고, 임상 적용을 탐색합니다.
        </div>
        <div
          style={{
            fontFamily: 'var(--display)',
            fontSize: 19,
            letterSpacing: 3,
            color: 'var(--navy)',
            marginTop: 8,
          }}
        >
          ASK. LEARN. APPLY.
        </div>
      </div>
    </div>
  )
}

export default React.memo(Welcome)
