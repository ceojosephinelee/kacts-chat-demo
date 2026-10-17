import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'

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
  onCreateNewChat,
}) => {
  return (
    <div
      className="shrink-0 flex items-center justify-between"
      style={{
        height: 84,
        borderBottom: '1px solid var(--line)',
        paddingLeft: 40,
        paddingRight: 40,
        background: 'var(--saphia-bg)',
      }}
    >
      <div className="flex items-center" style={{ gap: 13 }}>
        {isMobile && (
          <div
            className="flex items-center justify-center h-8 w-8 cursor-pointer mr-2"
            onClick={() => onShowSideBar?.()}
          >
            <Bars3Icon className="h-5 w-5" style={{ color: 'var(--navy)' }} />
          </div>
        )}
        <img
          src="/saphia_symbol.png"
          alt="SAPHIA"
          style={{ height: 50, width: 'auto', display: 'block' }}
        />
        <div style={{ lineHeight: 1.18 }}>
          <div style={{ fontWeight: 700, fontSize: 21, color: 'var(--navy)', letterSpacing: -0.2 }}>
            세포유전자 상태의학회
          </div>
          <div style={{ fontSize: 8.5, color: 'var(--navy)', opacity: 0.72, letterSpacing: 1.2, marginTop: 3 }}>
            SOCIETY OF CELLULAR AND GENOMIC STATE MEDICINE
          </div>
        </div>
      </div>
      {isMobile && (
        <div
          className="flex items-center justify-center h-8 w-8 cursor-pointer"
          onClick={() => onCreateNewChat?.()}
        >
          <PencilSquareIcon className="h-5 w-5" style={{ color: 'var(--navy)' }} />
        </div>
      )}
    </div>
  )
}

export default React.memo(Header)