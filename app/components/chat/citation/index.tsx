'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import type { CitationItem } from '../type'
import type { Ref } from '@/lib/refs'
import { lookupRefs } from '@/lib/refs'

interface ICitationProps {
  citations: CitationItem[]
}

function dedupRefs(refs: Ref[]): Ref[] {
  const seen = new Set<string>()
  return refs.filter(r => {
    const key = r.pmid ?? r.doi ?? r.cite
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function refTag(ref: Ref): string | null {
  if (!ref.url) return null
  if (ref.pmid || ref.pmcid) return 'PubMed'
  if (ref.doi) return 'DOI'
  return null
}

const Citation: FC<ICitationProps> = ({ citations }) => {
  const [refs, setRefs] = useState<Ref[]>([])

  useEffect(() => {
    if (!citations || citations.length === 0) return
    const docNames = [...new Set(citations.map(c => c.document_name))]
    Promise.all(docNames.map(n => lookupRefs(n)))
      .then(results => setRefs(dedupRefs(results.flat())))
      .catch(() => {})
  }, [citations])

  if (!refs.length) return null

  return (
    <div style={{ marginTop: 11, paddingTop: 10, borderTop: '1px dashed var(--line, #e6e8ee)' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-soft, #707887)', marginBottom: 6, fontWeight: 600 }}>
        근거 논문
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {refs.map((ref, i) => {
          const tag = refTag(ref)
          const chip = (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: 5,
                padding: '4px 10px',
                fontSize: 11,
                lineHeight: 1.5,
                fontFamily: 'var(--body)',
                color: 'var(--navy, #1b2c56)',
                background: 'var(--navy-soft, #e9edf6)',
                border: '1px solid var(--navy-hover, #f2f4f9)',
                borderRadius: 6,
              }}
            >
              <span>{ref.cite}</span>
              {tag && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#fff',
                  background: 'var(--navy, #1b2c56)',
                  borderRadius: 4,
                  padding: '1px 5px',
                  flexShrink: 0,
                }}>
                  {tag}
                </span>
              )}
            </span>
          )

          return ref.url
            ? (
              <a
                key={i}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'inline-flex' }}
              >
                {chip}
              </a>
            )
            : <span key={i} style={{ display: 'inline-flex' }}>{chip}</span>
        })}
      </div>
    </div>
  )
}

export default React.memo(Citation)
