import type { FC } from 'react'
import React from 'react'

export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}
const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
}) => {
  return (
    <div
      className="shrink-0 flex items-center"
      style={{
        height: 64,
        borderBottom: '1px solid var(--line)',
        paddingLeft: isMobile ? 16 : 20,
        paddingRight: isMobile ? 16 : 20,
        background: 'var(--saphia-bg)',
        gap: 12,
      }}
    >
      <img
        src="/saphihugh_logo.png"
        alt="SAPHIHUGH"
        style={{
          height: isMobile ? 34 : 46,
          width: 'auto',
          display: 'block',
          marginRight: 'auto',
        }}
      />
      {isMobile && (
        <button
          onClick={() => onShowSideBar?.()}
          style={{
            width: 30,
            height: 34,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 8,
            padding: 0,
            flexShrink: 0,
          }}
          aria-label="Menu"
        >
          <span style={{ display: 'block', height: 3, background: 'var(--navy)', borderRadius: 2, width: '100%' }} />
          <span style={{ display: 'block', height: 3, background: 'var(--navy)', borderRadius: 2, width: '100%' }} />
        </button>
      )}
    </div>
  )
}

export default React.memo(Header)
