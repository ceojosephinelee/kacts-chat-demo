export interface Ref {
  n: number
  cite: string
  pmid: string | null
  pmcid: string | null
  doi: string | null
  url: string | null
}

interface RefsJson {
  documents: Record<string, { title: string; refs: Ref[] }>
}

let cache: RefsJson | null = null
let fetchPromise: Promise<RefsJson> | null = null

async function getRefsJson(): Promise<RefsJson> {
  if (cache) return cache
  if (fetchPromise) return fetchPromise

  fetchPromise = fetch('/refs.json')
    .then(r => r.json() as Promise<RefsJson>)
    .then(data => {
      cache = data
      return data
    })

  return fetchPromise
}

export async function lookupRefs(documentName: string): Promise<Ref[]> {
  const data = await getRefsJson()
  const key = documentName.normalize('NFC').replace(/\.(md|pdf|txt|docx?)$/i, '')
  return data.documents[key]?.refs ?? []
}
