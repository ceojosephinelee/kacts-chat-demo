export interface RefItem {
  n: string
  text: string
  url?: string
}

export interface SplitAnswerResult {
  lead: string
  body: string
  refs: RefItem[]
}

const REFS_HEADING = /^\s{0,3}(#{1,6}\s*)?\**\s*참고\s*문헌\s*\**\s*:?\s*$/m
const REF_LINE = /^\s*\[?(\d+)\]?[.)]?\s+(.+)$/
const PUBMED_LINK = /\[PubMed\]\((https?:\/\/[^)\s]+)\)/

export function splitAnswer(content: string): SplitAnswerResult {
  try {
    // 1. 참고 문헌 분리 — 마지막 매칭 줄 기준
    const lines = content.split('\n')
    let refsHeadingIdx = -1
    for (let i = lines.length - 1; i >= 0; i--) {
      if (REFS_HEADING.test(lines[i])) {
        refsHeadingIdx = i
        break
      }
    }

    let bodyText = content
    let refs: RefItem[] = []

    if (refsHeadingIdx !== -1) {
      const bodyLines = lines.slice(0, refsHeadingIdx)
      const refLines = lines.slice(refsHeadingIdx + 1)

      const parsed: RefItem[] = []
      for (const line of refLines) {
        const m = line.match(REF_LINE)
        if (!m) continue
        const n = m[1]
        const raw = m[2]
        const urlMatch = raw.match(PUBMED_LINK)
        const url = urlMatch ? urlMatch[1] : undefined
        const text = raw.replace(PUBMED_LINK, '').trim()
        parsed.push({ n, text, url })
      }

      if (parsed.length > 0) {
        bodyText = bodyLines.join('\n').trimEnd()
        refs = parsed
      }
    }

    // 2. 결론 문장(lead) 분리
    const SPECIAL_START = /^(#{1,6}[\s]|-|\*|\||>|\d+\.)/
    const firstBlank = bodyText.indexOf('\n\n')
    const firstPara = firstBlank === -1 ? bodyText : bodyText.slice(0, firstBlank)
    const trimmedPara = firstPara.trim()

    let lead = ''
    let body = bodyText

    if (
      trimmedPara.length > 0 &&
      trimmedPara.length <= 200 &&
      !SPECIAL_START.test(trimmedPara)
    ) {
      lead = trimmedPara
      body = firstBlank === -1 ? '' : bodyText.slice(firstBlank + 2)
    }

    return { lead, body, refs }
  }
  catch {
    return { lead: '', body: content, refs: [] }
  }
}
