import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;
  
  // Define paths that don't require authentication
  const isPublicPath = path === '/authentication/login' || 
                       path === '/authentication/register' || 
                       path.startsWith('/_next') || 
                       path.includes('/api/');
  
  // Check if user is authenticated by looking for the auth token in cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // If the user is not authenticated and is trying to access a protected route,
  // redirect to the login page
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/authentication/login', request.url));
  }
  
  // If the user is authenticated and is trying to access login or register,
  // redirect to the dashboard
  if (token && (path === '/authentication/login' || path === '/authentication/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Apply middleware to all routes except for static files, api routes, etc.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
