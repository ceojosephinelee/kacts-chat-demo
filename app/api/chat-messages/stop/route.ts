import type { NextRequest } from 'next/server'
import { getInfo } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'

export async function POST(request: NextRequest) {
  const { taskId } = await request.json()
  const { user } = getInfo(request)

  const baseUrl = (API_URL || '').replace(/\/$/, '')
  const res = await fetch(`${baseUrl}/chat-messages/${taskId}/stop`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user }),
  })

  const data = await res.json().catch(() => ({}))
  return Response.json(data, { status: res.status })
}
