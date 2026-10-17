import React from 'react'
import type { FC } from 'react'
import type { ConversationItem } from '@/types/app'

const MAX_CONVERSATION_LENTH = 20

export interface ISidebarProps {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
}) => {
  return (
    <div
      className="shrink-0 flex flex-col overflow-y-auto"
      style={{
        width: 248,
        background: 'var(--sidebg)',
        borderRight: '1px solid var(--line)',
        padding: '16px 12px',
      }}
    >
      {list.length < MAX_CONVERSATION_LENTH && (
        <button
          onClick={() => onCurrentIdChange('-1')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
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
      )}

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

      <nav className="flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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