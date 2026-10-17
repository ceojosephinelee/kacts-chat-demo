'use client'
import type { FC } from 'react'
import React from 'react'
import type { IChatItem } from '../type'

import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import ImageGallery from '@/app/components/base/image-gallery'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
}

const Question: FC<IQuestionProps> = ({ id, content, imgSrcs }) => {
  return (
    <div className='flex items-start' style={{ flexDirection: 'row-reverse', gap: 13 }} key={id}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 7,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          fontSize: 12,
          fontWeight: 700,
          background: 'var(--cream)',
          color: 'var(--cream-ink)',
          border: '1px solid var(--cream-line)',
        }}
      >
        Q
      </div>
      <div
        style={{
          borderRadius: 13,
          padding: '14px 17px',
          fontSize: 14,
          lineHeight: 1.75,
          maxWidth: '82%',
          background: 'var(--cream)',
          border: '1px solid var(--cream-line)',
          color: '#3f3414',
        }}
      >
        {imgSrcs && imgSrcs.length > 0 && (
          <ImageGallery srcs={imgSrcs} />
        )}
        <StreamdownMarkdown content={content} />
      </div>
    </div>
  )
}

export default React.memo(Question)
