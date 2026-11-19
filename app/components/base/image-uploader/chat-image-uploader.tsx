'use client'

import type { FC } from 'react'
import Uploader from './uploader'
import type { ImageFile, VisionSettings } from '@/types/app'

interface ChatImageUploaderProps {
  settings: VisionSettings
  onUpload: (imageFile: ImageFile) => void
  disabled?: boolean
}

const ChatImageUploader: FC<ChatImageUploaderProps> = ({ settings, onUpload, disabled }) => (
  <Uploader onUpload={onUpload} disabled={disabled} limit={+settings.image_file_size_limit!}>
    {hovering => (
      <div
        className={`relative flex items-center justify-center w-8 h-8 rounded-lg ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${hovering && !disabled ? 'bg-gray-100' : ''}`}
        style={{ opacity: disabled ? 0.4 : 1 }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ink-soft, #707887)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      </div>
    )}
  </Uploader>
)

export default ChatImageUploader
