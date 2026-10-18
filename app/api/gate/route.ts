import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  const sitePassword = process.env.SITE_PASSWORD
  const gateToken = process.env.GATE_TOKEN

  if (!sitePassword || !gateToken) {
    return NextResponse.json({ error: 'Gate not configured' }, { status: 500 })
  }

  if (password !== sitePassword) {
    return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('saphia_auth', gateToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return response
}
