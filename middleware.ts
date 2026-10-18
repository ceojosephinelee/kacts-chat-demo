import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const gateToken = process.env.GATE_TOKEN
  const sitePassword = process.env.SITE_PASSWORD

  // Gate disabled if env vars not configured
  if (!gateToken || !sitePassword) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Skip: gate page, gate API, static files
  if (
    pathname === '/gate'
    || pathname.startsWith('/api/gate')
  ) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get('saphia_auth')?.value

  if (authCookie === gateToken) {
    return NextResponse.next()
  }

  // Redirect to /gate, preserving original URL as ?redirect=
  const url = request.nextUrl.clone()
  const originalPath = url.pathname + url.search
  url.pathname = '/gate'
  url.search = `?redirect=${encodeURIComponent(originalPath)}`

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|svg|css|js)$).*)'],
}
