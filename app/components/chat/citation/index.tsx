'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import type { CitationItem } from '../type'
import type { Ref } from '@/lib/refs'
import { lookupRefs } from '@/lib/refs'

// lib/refs.ts は「この資料の参考文献を見る」機能で再利用予定のため残置

interface ICitationProps {
  citations: CitationItem[]
}

function formatDocName(raw: string): string {
  return raw
    .replace(/\.(pdf|docx?|md)$/i, '')
    .replace(/_/g, ' ')
    .replace(/SS-a?PRe?([FP])/g, 'SPRe$1')
}

const Citation: FC<ICitationProps> = ({ citations }) => {
  const [refsMap, setRefsMap] = useState<Record<string, Ref[]>>({})
  const [openDoc, setOpenDoc] = useState<string | null>(null)
  const fetchedRef = useRef<Set<string>>(new Set())

  const seen = new Set<string>()
  const docNames: string[] = []
  if (citations) {
    for (const c of citations) {
      if (!seen.has(c.document_name)) {
        seen.add(c.document_name)
        docNames.push(c.document_name)
      }
    }
  }

  const depsKey = docNames.join('\x00')

  useEffect(() => {
    docNames.forEach(async (name) => {
      if (fetchedRef.current.has(name)) return
      fetchedRef.current.add(name)
      const refs = await lookupRefs(name)
      setRefsMap(prev => ({ ...prev, [name]: refs }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey])

  if (!citations || citations.length === 0) return null
  if (!docNames.length) return null

  const handleChipClick = (name: string) => {
    const refs = refsMap[name]
    if (!refs || refs.length === 0) return
    setOpenDoc(prev => prev === name ? null : name)
  }

  const badgeStyle: React.CSSProperties = {
    marginLeft: 5,
    fontSize: 10,
    padding: '1px 6px',
    background: 'var(--navy-soft, #e9edf6)',
    color: 'var(--navy, #1b2c56)',
    borderRadius: 999,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  return (
    <div style={{ marginTop: 11, paddingTop: 10, borderTop: '1px dashed var(--line, #e6e8ee)' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-soft, #707887)', marginBottom: 3, fontWeight: 600 }}>
        참고한 학회 자료
      </div>
      <div style={{ fontSize: 10, color: 'var(--ink-soft, #707887)', marginBottom: 7 }}>
        답변 중 임상 판단·추론 부분은 자료에 없는 내용입니다.
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {docNames.map((name, i) => {
          const refs = refsMap[name]
          const count = refs?.length ?? null
          const hasRefs = count !== null && count > 0
          const isOpen = openDoc === name

          return (
            <span
              key={i}
              onClick={() => handleChipClick(name)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                padding: '3px 10px',
                fontSize: 11,
                lineHeight: 1.5,
                fontFamily: 'var(--body)',
                color: 'var(--navy, #1b2c56)',
                background: 'var(--navy-soft, #e9edf6)',
                border: `1px solid ${isOpen ? 'var(--navy, #1b2c56)' : 'var(--navy-hover, #f2f4f9)'}`,
                borderRadius: 999,
                cursor: hasRefs ? 'pointer' : 'default',
                userSelect: 'none',
              }}
            >
              {formatDocName(name)}
              {hasRefs && (
                <>
                  <span style={{ fontSize: 10, color: 'var(--ink-soft, #707887)' }}>
                    ({count})
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--ink-soft, #707887)', lineHeight: 1 }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </>
              )}
            </span>
          )
        })}
      </div>

      {openDoc && refsMap[openDoc] && refsMap[openDoc].length > 0 && (
        <div
          style={{
            marginTop: 8,
            padding: '10px 12px',
            background: '#f8f9fb',
            borderRadius: 8,
            border: '1px solid var(--line, #e6e8ee)',
          }}
        >
          <div style={{ fontSize: 10, color: 'var(--ink-soft, #707887)', marginBottom: 8 }}>
            이 자료 전체가 참고한 문헌 목록입니다. 답변 내용과 직접 대응하지는 않습니다.
          </div>
          <ol style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {refsMap[openDoc].map(ref => (
              <li key={ref.n} style={{ fontSize: 11, color: 'var(--ink, #1a2235)', lineHeight: 1.65 }}>
                {ref.cite}
                {ref.pmid && (
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={badgeStyle}
                  >
                    PubMed
                  </a>
                )}
                {ref.doi && (
                  <a
                    href={`https://doi.org/${ref.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={badgeStyle}
                  >
                    DOI
                  </a>
                )}
                {ref.url && !ref.pmid && !ref.doi && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={badgeStyle}
                  >
                    Link
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default React.memo(Citation)
