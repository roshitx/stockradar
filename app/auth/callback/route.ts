import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const sanitizedNext = next.startsWith('/') ? next : '/'
      const origin = forwardedHost ? `https://${forwardedHost}` : requestUrl.origin
      
      return NextResponse.redirect(`${origin}${sanitizedNext}`)
    }
  }

  const forwardedHost = request.headers.get('x-forwarded-host')
  const origin = forwardedHost ? `https://${forwardedHost}` : requestUrl.origin
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
