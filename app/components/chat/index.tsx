'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import FileUploaderInAttachmentWrapper from '@/app/components/base/file-uploader-in-attachment'
import type { FileEntity, FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { getProcessedFiles } from '@/app/components/base/file-uploader-in-attachment/utils'

export interface IChatProps {
  chatList: ChatItem[]
  feedbackDisabled?: boolean
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  fileConfig?: FileUpload
  initialQuery?: string
  onInitialQuerySent?: () => void
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  fileConfig,
  initialQuery,
  onInitialQuerySent,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')

  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    const query = queryRef.current
    if (!query || query.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const [attachmentFiles, setAttachmentFiles] = React.useState<FileEntity[]>([])

  const initialQuerySentRef = useRef(false)
  useEffect(() => {
    if (!initialQuery) {
      initialQuerySentRef.current = false
      return
    }
    if (!initialQuerySentRef.current) {
      initialQuerySentRef.current = true
      onSend(initialQuery, [])
      onInitialQuerySent?.()
    }
  }, [initialQuery])

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend())) { return }
    const hasPendingImageUploads = files.some(file => file.progress !== -1 && file.progress < 100)
    const hasPendingAttachmentUploads = attachmentFiles.some(file => file.progress !== -1 && file.progress < 100)
    if (hasPendingImageUploads || hasPendingAttachmentUploads) {
      logError(t('app.errorMessage.waitForFileUpload'))
      return
    }
    const imageFiles: VisionFile[] = files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    }))
    const docAndOtherFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    const combinedFiles: VisionFile[] = [...imageFiles, ...docAndOtherFiles]
    onSend(queryRef.current, combinedFiles)
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length) { onClear() }
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
    if (!attachmentFiles.find(item => item.transferMethod === TransferMethod.local_file && !item.uploadedId)) { setAttachmentFiles([]) }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      if (!e.shiftKey && !isUseInputMethod.current) { handleSend() }
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      const result = query.replace(/\n$/, '')
      setQuery(result)
      queryRef.current = result
      e.preventDefault()
    }
  }

  const suggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    queryRef.current = suggestion
    handleSend()
  }

  return (
    <div className="h-full" style={{ fontFamily: 'var(--body)' }}>
      {/* Chat List */}
      <div
        className="h-full"
        style={{ padding: '30px 0' }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto', paddingLeft: 24, paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {chatList.map((item) => {
            if (item.isAnswer) {
              const isLast = item.id === chatList[chatList.length - 1].id
              return <Answer
                key={item.id}
                item={item}
                feedbackDisabled={feedbackDisabled}
                onFeedback={onFeedback}
                isResponding={isResponding && isLast}
                suggestionClick={suggestionClick}
              />
            }
            return (
              <Question
                key={item.id}
                id={item.id}
                content={item.content}
                useCurrentUserAvatar={useCurrentUserAvatar}
                imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
              />
            )
          })}
        </div>
      </div>
      {
        !isHideSendInput && (
          <div
            style={{
              borderTop: '1px solid var(--line)',
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 24,
              paddingRight: 24,
              flexShrink: 0,
              background: 'var(--saphia-bg)',
              position: 'sticky',
              bottom: 0,
            }}
          >
            <div
              style={{
                maxWidth: 720,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                border: '1.5px solid var(--line)',
                borderRadius: 14,
                padding: '5px 5px 5px 18px',
                background: 'var(--saphia-bg)',
              }}
              className="focus-within:!border-[#1b2c56]"
            >
              {
                visionConfig?.enabled && (
                  <div className='flex items-center'>
                    <ChatImageUploader
                      settings={visionConfig}
                      onUpload={onUpload}
                      disabled={files.length >= visionConfig.number_limits}
                    />
                    <div className='mx-1 w-[1px] h-4 bg-black/5' />
                  </div>
                )
              }
              {
                visionConfig?.enabled && files.length > 0 && (
                  <ImageList
                    list={files}
                    onRemove={onRemove}
                    onReUpload={onReUpload}
                    onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                    onImageLinkLoadError={onImageLinkLoadError}
                  />
                )
              }
              {
                fileConfig?.enabled && (
                  <FileUploaderInAttachmentWrapper
                    fileConfig={fileConfig}
                    value={attachmentFiles}
                    onChange={setAttachmentFiles}
                  />
                )
              }
              <Textarea
                className="flex-1 border-none outline-none text-sm bg-transparent resize-none"
                style={{
                  fontSize: 14,
                  fontFamily: 'var(--body)',
                  padding: '11px 0',
                  color: 'var(--ink)',
                }}
                placeholder="이어서 질문하기"
                value={query}
                onChange={handleContentChange}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                autoSize
              />
              <button
                className={s.sendBtn}
                onClick={handleSend}
                aria-label="Send"
              >
                ↑
              </button>
            </div>
            <div
              style={{
                maxWidth: 720,
                margin: '10px auto 0',
                textAlign: 'center',
                fontSize: 11,
                color: 'var(--ink-soft)',
              }}
            >
              SAPHIA는 임상 참고 정보를 제공하며, 특정 환자의 진단·처방을 대신하지 않습니다.
            </div>
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Chat)
