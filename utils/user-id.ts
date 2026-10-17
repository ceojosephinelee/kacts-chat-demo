const STORAGE_KEY = 'saphia_uid'

export function getSaphiaUserId(): string {
  if (typeof window === 'undefined') return ''

  const params = new URLSearchParams(window.location.search)
  const urlUser = params.get('u')

  if (urlUser) {
    localStorage.setItem(STORAGE_KEY, urlUser)
    return urlUser
  }

  return localStorage.getItem(STORAGE_KEY) || ''
}
