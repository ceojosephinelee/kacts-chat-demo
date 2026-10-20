'use client'
import type { FC } from 'react'
import React, { useState } from 'react'
import type { CitationItem } from '../type'

interface ICitationProps {
  citations: CitationItem[]
}

interface GroupedCitation {
  document_name: string
  items: CitationItem[]
}

const Citation: FC<ICitationProps> = ({ citations }) => {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)

  if (!citations || citations.length === 0) return null

  // Deduplicate by document_name, keep all items grouped
  const grouped: GroupedCitation[] = []
  const seen = new Set<string>()
  for (const c of citations) {
    if (!seen.has(c.document_name)) {
      seen.add(c.document_name)
      grouped.push({
        document_name: c.document_name,
        items: citations.filter(x => x.document_name === c.document_name),
      })
    }
  }

  const toggleDoc = (docName: string) => {
    setExpandedDoc(prev => prev === docName ? null : docName)
  }

  return (
    <div style={{ marginTop: 11, paddingTop: 10, borderTop: '1px dashed var(--line, #e6e8ee)' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-soft, #707887)', marginBottom: 6, fontWeight: 600 }}>
        출처
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {grouped.map(g => (
          <div key={g.document_name} style={{ display: 'inline-flex', flexDirection: 'column' }}>
            <button
              onClick={() => toggleDoc(g.document_name)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 10px',
                fontSize: 11,
                fontFamily: 'var(--body)',
                color: 'var(--navy, #1b2c56)',
                background: 'var(--navy-soft, #e9edf6)',
                border: '1px solid var(--navy-hover, #f2f4f9)',
                borderRadius: 999,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                maxWidth: 220,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={g.document_name}
            >
              <span style={{ flexShrink: 0, fontSize: 10 }}>📄</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.document_name}</span>
            </button>
            {expandedDoc === g.document_name && (
              <div
                style={{
                  marginTop: 6,
                  padding: '10px 12px',
                  background: 'var(--navy-hover, #f2f4f9)',
                  border: '1px solid var(--line, #e6e8ee)',
                  borderRadius: 8,
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: 'var(--ink, #1c2230)',
                  maxWidth: 400,
                }}
              >
                {g.items.map((item, i) => (
                  <div key={i} style={{ marginBottom: i < g.items.length - 1 ? 8 : 0 }}>
                    <div style={{
                      fontSize: 10,
                      color: 'var(--ink-soft, #707887)',
                      marginBottom: 3,
                    }}>
                      일치도 {Math.round(item.score * 100)}%
                    </div>
                    <div style={{
                      fontSize: 12,
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(Citation)