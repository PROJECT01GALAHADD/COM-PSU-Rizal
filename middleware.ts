import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/signup',
  '/guest',
  '/api/auth/login',
  '/api/auth/signup',
  '/About',
  '/announcement',
  '/faq',
  '/privacy-policy',
  '/acceptable-use',
  '/t&c',
]

// Define exact-match public routes (not using startsWith)
const exactPublicRoutes = ['/']

// Define routes that should redirect to a centralized login page
const loginRedirectRoutes = [
  '/admin/login',
  '/student/login',
  '/faculty/login',
]

// Define role-based access control
const roleBasedRoutes: Record<string, string[]> = {
  '/admin': ['admin'],
  '/faculty': ['faculty', 'admin'],
  '/student': ['student', 'faculty', 'admin'],
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Redirect role-specific login pages to the centralized login page
  if (loginRedirectRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Allow exact-match public routes
  if (exactPublicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow public routes (using startsWith for nested paths)
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow guest access to meetings when guest=true is present
  if (pathname.startsWith('/meetings/') && searchParams.get('guest') === 'true') {
    return NextResponse.next()
  }

  // Demo-mode bypass: check cookie set by demoLogin
  const demoMode = request.cookies.get('demo_mode')?.value === 'true'
  if (demoMode) {
    const demoAuthRaw = request.cookies.get('demo_auth')?.value
    try {
      const demoAuth = demoAuthRaw ? JSON.parse(decodeURIComponent(demoAuthRaw)) as { id: string; email: string; role: string } : null
      if (demoAuth) {
        // Enforce role-based routing for demo
        for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
          if (pathname.startsWith(route) && !allowedRoles.includes(demoAuth.role)) {
            // Forbidden for this role
            return NextResponse.redirect(new URL('/login', request.url))
          }
        }
        // Allowed for this demo user
        return NextResponse.next()
      }
    } catch (e) {
      // Invalid demo cookie; fall through to standard auth
    }
  }

  // Get token from cookies or authorization header
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    // Redirect to login for web pages
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Verify token (Edge runtime compatible)
    const rawSecret =
      process.env.SUPABASE_JWT_SECRET ||
      process.env.JWT_SECRET
    
    if (!rawSecret) {
      console.error('JWT_SECRET or SUPABASE_JWT_SECRET not configured')
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }
    
    const secret = new TextEncoder().encode(rawSecret)
    const { payload } = await jwtVerify(token, secret)
    const decoded = payload as {
      userId: string
      email: string
      userType?: string // Optional since middleware skips role checks if missing
    }

    // Attach user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', decoded.userId)
    requestHeaders.set('x-user-email', decoded.email)
    // Ensure string value for header (avoid undefined)
    requestHeaders.set('x-user-type', decoded.userType ?? '')

    // Check role-based access only if token contains a userType claim.
    if (decoded.userType) {
      for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
        if (
          pathname.startsWith(route) &&
          !allowedRoles.includes(decoded.userType)
        ) {
          return NextResponse.json(
            { error: 'Forbidden: Insufficient permissions' },
            { status: 403 }
          )
        }
      }
    }

    // Continue with the request
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error('Token verification error:', error)

    // Remove invalid token
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')

    return response
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons|images|fonts).*)',
  ],
}
