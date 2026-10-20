'use client'
import type { FC } from 'react'
import type { FeedbackFunc } from '../type'
import type { ChatItem, MessageRating, VisionFile } from '@/types/app'
import type { Emoji } from '@/types/tools'
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/app/components/base/button'
import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import Tooltip from '@/app/components/base/tooltip'
import WorkflowProcess from '@/app/components/workflow/workflow-process'
import { randomString } from '@/utils/string'
import ImageGallery from '../../base/image-gallery'
import LoadingAnim from '../loading-anim'
import s from '../style.module.css'
import Citation from '../citation'
import Thought from '../thought'

function OperationBtn({ innerContent, onClick, className }: { innerContent: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <div
      className={`relative box-border flex items-center justify-center h-7 w-7 p-0.5 rounded-lg bg-white cursor-pointer text-gray-500 hover:text-gray-800 ${className ?? ''}`}
      style={{ boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.05)' }}
      onClick={onClick && onClick}
    >
      {innerContent}
    </div>
  )
}

const RatingIcon: FC<{ isLike: boolean }> = ({ isLike }) => {
  return isLike ? <HandThumbUpIcon className="w-4 h-4" /> : <HandThumbDownIcon className="w-4 h-4" />
}

const IconWrapper: FC<{ children: React.ReactNode | string }> = ({ children }) => {
  return (
    <div className="rounded-lg h-6 w-6 flex items-center justify-center hover:bg-gray-100">
      {children}
    </div>
  )
}

interface IAnswerProps {
  item: ChatItem
  feedbackDisabled: boolean
  onFeedback?: FeedbackFunc
  isResponding?: boolean
  allToolIcons?: Record<string, string | Emoji>
  suggestionClick?: (suggestion: string) => void
}

const Answer: FC<IAnswerProps> = ({
  item,
  feedbackDisabled = false,
  onFeedback,
  isResponding,
  allToolIcons,
  suggestionClick = () => { },
}) => {
  const { id, content, feedback, agent_thoughts, workflowProcess, suggestedQuestions = [], citation } = item
  const isAgentMode = !!agent_thoughts && agent_thoughts.length > 0

  const { t } = useTranslation()

  const renderFeedbackRating = (rating: MessageRating | undefined) => {
    if (!rating) { return null }

    const isLike = rating === 'like'
    const ratingIconClassname = isLike ? 'text-primary-600 bg-primary-100 hover:bg-primary-200' : 'text-red-600 bg-red-100 hover:bg-red-200'
    return (
      <Tooltip
        selector={`user-feedback-${randomString(16)}`}
        content={isLike ? '取消赞同' : '取消反对'}
      >
        <div
          className="relative box-border flex items-center justify-center h-7 w-7 p-0.5 rounded-lg bg-white cursor-pointer text-gray-500 hover:text-gray-800"
          style={{ boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.05)' }}
          onClick={async () => {
            await onFeedback?.(id, { rating: null })
          }}
        >
          <div className={`${ratingIconClassname} rounded-lg h-6 w-6 flex items-center justify-center`}>
            <RatingIcon isLike={isLike} />
          </div>
        </div>
      </Tooltip>
    )
  }

  const renderItemOperation = () => {
    const userOperation = () => {
      return feedback?.rating
        ? null
        : (
          <div className="flex gap-1">
            <Tooltip selector={`user-feedback-${randomString(16)}`} content={t('common.operation.like') as string}>
              {OperationBtn({ innerContent: <IconWrapper><RatingIcon isLike={true} /></IconWrapper>, onClick: () => onFeedback?.(id, { rating: 'like' }) })}
            </Tooltip>
            <Tooltip selector={`user-feedback-${randomString(16)}`} content={t('common.operation.dislike') as string}>
              {OperationBtn({ innerContent: <IconWrapper><RatingIcon isLike={false} /></IconWrapper>, onClick: () => onFeedback?.(id, { rating: 'dislike' }) })}
            </Tooltip>
          </div>
        )
    }

    return (
      <div className={`${s.answerWrap} flex gap-2`}>
        {userOperation()}
      </div>
    )
  }

  const getImgs = (list?: VisionFile[]) => {
    if (!list) { return [] }
    return list.filter(file => file.type === 'image' && file.belongs_to === 'assistant')
  }

  const agentModeAnswer = (
    <div>
      {agent_thoughts?.map((item, index) => (
        <div key={index}>
          {item.thought && (
            <StreamdownMarkdown content={item.thought} />
          )}
          {!!item.tool && (
            <Thought
              thought={item}
              allToolIcons={allToolIcons || {}}
              isFinished={!!item.observation || !isResponding}
            />
          )}

          {getImgs(item.message_files).length > 0 && (
            <ImageGallery srcs={getImgs(item.message_files).map(item => item.url)} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div key={id} className="flex items-start" style={{ gap: 13 }}>
      {/* S avatar */}
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
          background: 'var(--navy)',
          color: '#fff',
          fontFamily: 'var(--display)',
          position: 'relative',
        }}
      >
        S
        {isResponding && (
          <div className={s.typeingIcon}>
            <LoadingAnim type="avatar" />
          </div>
        )}
      </div>

      {/* bubble */}
      <div className={s.answerWrap} style={{ maxWidth: 'calc(100% - 3rem)' }}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              borderRadius: 13,
              padding: '14px 17px',
              fontSize: 14,
              lineHeight: 1.75,
              maxWidth: '82%',
              background: 'var(--ai-bubble)',
              border: '1px solid var(--line)',
            }}
          >
            {workflowProcess && (
              <WorkflowProcess data={workflowProcess} hideInfo />
            )}
            {(isResponding && (isAgentMode ? (!content && (agent_thoughts || []).filter(item => !!item.thought || !!item.tool).length === 0) : !content))
              ? (
                <div className="flex items-center justify-center w-6 h-5">
                  <LoadingAnim type="text" />
                </div>
              )
              : (isAgentMode
                ? agentModeAnswer
                : (
                  <StreamdownMarkdown content={content} />
                ))}
            {suggestedQuestions.length > 0 && (
              <div className="mt-3">
                <div className="flex gap-1 mt-1 flex-wrap">
                  {suggestedQuestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Button className="text-sm" type="link" onClick={() => suggestionClick(suggestion)}>{suggestion}</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {citation && citation.length > 0 && (
              <Citation citations={citation} />
            )}
          </div>
          <div className="absolute top-[-14px] right-[-14px] flex flex-row justify-end gap-1">
            {!feedbackDisabled && !item.feedbackDisabled && renderItemOperation()}
            {!feedbackDisabled && renderFeedbackRating(feedback?.rating)}
          </div>
        </div>
      </div>
    </div>
  )
}
export default React.memo(Answer)
