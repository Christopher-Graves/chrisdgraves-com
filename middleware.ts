import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if authenticated via cookie
    const authCookie = request.cookies.get('admin_authenticated');
    
    // If not authenticated and not on login page, redirect to login
    if (!authCookie?.value && !request.nextUrl.pathname.endsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
