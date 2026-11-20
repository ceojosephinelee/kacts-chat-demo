'use client'
import type { FC } from 'react'
import React, { useRef, useState } from 'react'
import type { AppInfo, PromptConfig, VisionFile, VisionSettings } from '@/types/app'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import Loading02 from '@/app/components/base/icons/line/loading-02'
import FileUploaderInAttachmentWrapper from '@/app/components/base/file-uploader-in-attachment'
import type { FileEntity, FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { getProcessedFiles } from '@/app/components/base/file-uploader-in-attachment/utils'

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
  onSendFirstMessage?: (message: string, files: VisionFile[]) => void
  visionConfig?: VisionSettings
  fileConfig?: FileUpload
}

const Welcome: FC<IWelcomeProps> = ({
  hasSetInputs,
  onSendFirstMessage,
  visionConfig,
  fileConfig,
}) => {
  const [query, setQuery] = useState('')
  const queryRef = useRef('')
  const isUseInputMethod = useRef(false)
  const [attachmentFiles, setAttachmentFiles] = useState<FileEntity[]>([])

  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
  } = useImageFiles()

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    queryRef.current = e.target.value
  }

  const handleSend = () => {
    const msg = queryRef.current.trim()
    if (!msg) return
    if (files.some(f => f.progress > -1 && f.progress < 100)) return
    if (attachmentFiles.some(f => f.progress !== -1 && f.progress < 100)) return
    const imageFiles: VisionFile[] = files
      .filter(f => f.progress !== -1)
      .map(f => ({
        type: 'image',
        transfer_method: f.type,
        url: f.url,
        upload_file_id: f.fileId,
      }))
    const docFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    onSendFirstMessage?.(msg, [...imageFiles, ...docFiles])
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

  const isUploading = files.some(f => f.progress > -1 && f.progress < 100)
    || attachmentFiles.some(f => f.progress !== -1 && f.progress < 100)
  const showUpload = !!visionConfig?.enabled
  const showFileUpload = !!fileConfig?.enabled
  const showAnyUpload = showUpload || showFileUpload

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: 'var(--body)',
      }}
    >
      <div
        style={{
          fontSize: 27,
          fontWeight: 600,
          marginBottom: 34,
          color: 'var(--ink)',
          letterSpacing: -0.3,
          textAlign: 'center',
        }}
        className="saphihugh-welcome-hi"
      >
        안녕하세요. 오늘도 함께할까요?
      </div>

      <div style={{ width: '100%', maxWidth: 760 }}>
        {showUpload && files.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <ImageList
              list={files}
              onRemove={onRemove}
              onReUpload={onReUpload}
              onImageLinkLoadSuccess={onImageLinkLoadSuccess}
              onImageLinkLoadError={onImageLinkLoadError}
            />
          </div>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: '1.6px solid var(--navy)',
            borderRadius: 999,
            padding: showAnyUpload ? '9px 9px 9px 16px' : '9px 9px 9px 28px',
            background: 'var(--saphia-bg)',
          }}
          className="saphihugh-pill focus-within:!border-[#1b2c56]"
        >
          {showUpload && (
            <div className="flex items-center">
              <ChatImageUploader
                settings={visionConfig!}
                onUpload={onUpload}
                disabled={files.length >= visionConfig!.number_limits}
              />
              <div className="mx-1 w-[1px] h-4 bg-black/5" />
            </div>
          )}
          {showFileUpload && (
            <FileUploaderInAttachmentWrapper
              fileConfig={fileConfig!}
              value={attachmentFiles}
              onChange={setAttachmentFiles}
            />
          )}
          <input
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              fontSize: 17,
              fontFamily: 'var(--body)',
              background: 'transparent',
              padding: '14px 0',
              color: 'var(--ink)',
            }}
            className="saphihugh-pill-input"
            placeholder="SAPHIHUGH 에게 물어보기"
            value={query}
            onChange={handleContentChange}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={isUploading}
            className="saphihugh-go-btn"
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'var(--navy)',
              color: '#fff',
              border: 'none',
              display: 'grid',
              placeItems: 'center',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              fontSize: 22,
              opacity: isUploading ? 0.6 : 1,
            }}
            aria-label="Send"
          >
            {isUploading ? <Loading02 className="animate-spin w-5 h-5" /> : '↑'}
          </button>
        </div>
        {showUpload && (
          <div style={{ marginTop: 4, fontSize: 10, color: 'var(--ink-soft)', paddingLeft: 4 }}>
            이미지 첨부 시 환자 식별정보(이름·차트번호)가 보이지 않도록 가린 뒤 올려주세요.
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 28, maxWidth: 640 }} className="saphihugh-tag">
        <div style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.7 }} className="saphihugh-tag-l1">
          학회의 연구와 학술 자료를 기반으로 필요한 지식을 찾고, 이해하고, 임상에 적용합니다.
        </div>
        <div
          style={{
            fontFamily: 'var(--display)',
            fontSize: 18,
            letterSpacing: 3,
            color: 'var(--navy)',
            marginTop: 8,
          }}
          className="saphihugh-tag-l2"
        >
          ASK. LEARN. APPLY.
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .saphihugh-welcome-hi {
            font-size: 21px !important;
            margin-bottom: 26px !important;
          }
          .saphihugh-pill {
            padding: 7px 7px 7px 13px !important;
          }
          .saphihugh-pill-input {
            font-size: 15px !important;
            padding: 12px 0 !important;
          }
          .saphihugh-go-btn {
            width: 46px !important;
            height: 46px !important;
            font-size: 19px !important;
          }
          .saphihugh-tag-l1 {
            font-size: 13px !important;
          }
          .saphihugh-tag-l2 {
            font-size: 15px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default React.memo(Welcome)
