import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signAdminToken, verifyAdminToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
  }

  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: 'Email and password are required' },
      { status: 400 }
    )
  }

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { success: false, message: 'Admin not configured' },
      { status: 500 }
    )
  }

  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  }

  // Support both plain text (dev) and bcrypt hash (prod) passwords
  let passwordValid = false
  if (adminPassword.startsWith('$2b$') || adminPassword.startsWith('$2a$')) {
    passwordValid = await bcrypt.compare(password, adminPassword)
  } else {
    passwordValid = password === adminPassword
  }

  if (!passwordValid) {
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  }

  const token = signAdminToken(email)

  const response = NextResponse.json({
    success: true,
    message: 'Authenticated successfully',
  })

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  response.cookies.delete(COOKIE_NAME)
  return response
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 })
  }
  const payload = verifyAdminToken(token)
  if (!payload) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ success: true, authenticated: true, email: payload.email })
}
