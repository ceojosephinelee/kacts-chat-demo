import React from 'react'
import type { FC } from 'react'
import type { ConversationItem } from '@/types/app'

export interface ISidebarProps {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
  isMobile?: boolean
  isOpen?: boolean
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
  isMobile,
  isOpen,
}) => {
  return (
    <div
      className="shrink-0 flex flex-col"
      style={{
        width: 260,
        height: '100%',
        overflow: 'hidden',
        background: 'var(--sidebg)',
        borderRight: isMobile ? 'none' : '1px solid var(--line)',
        borderLeft: isMobile ? '1px solid var(--line)' : 'none',
        ...(isMobile
          ? {
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 'auto',
              zIndex: 120,
              transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.25s ease',
              boxShadow: isOpen ? '-2px 0 18px rgba(0,0,0,0.08)' : 'none',
            }
          : {}),
      } as React.CSSProperties}
    >
      {/* 고정 상단 영역 */}
      <div style={{ flexShrink: 0, padding: '16px 12px 0' }}>
        <button
          onClick={() => onCurrentIdChange('-1')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            width: '100%',
            background: 'var(--navy)',
            color: '#fff',
            border: 'none',
            borderRadius: 9,
            padding: 11,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: 18,
            fontFamily: 'var(--body)',
          }}
        >
          + {'\u00A0'}새 채팅
        </button>

        <div
          style={{
            fontSize: 10,
            letterSpacing: 1,
            color: 'var(--ink-soft)',
            textTransform: 'uppercase',
            padding: '0 8px',
            marginBottom: 9,
          }}
        >
          내 대화
        </div>
      </div>

      <nav className="sidebar-nav" style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px 16px' }}>
        {list.map((item) => {
          const isCurrent = item.id === currentId
          return (
            <div
              onClick={() => onCurrentIdChange(item.id)}
              key={item.id}
              className="cursor-pointer"
              style={{
                padding: '10px 11px',
                borderRadius: 8,
                fontSize: 13,
                color: isCurrent ? 'var(--navy)' : 'var(--ink)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                background: isCurrent ? 'var(--navy-soft)' : 'transparent',
                fontWeight: isCurrent ? 600 : 400,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!isCurrent) e.currentTarget.style.background = 'var(--navy-hover)'
              }}
              onMouseLeave={(e) => {
                if (!isCurrent) e.currentTarget.style.background = 'transparent'
              }}
            >
              {item.name}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export default React.memo(Sidebar)
