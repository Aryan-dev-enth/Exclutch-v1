
import { NextResponse } from 'next/server';

export function middleware(req) {

  const path = req.nextUrl.pathname;
  
  
  const user = req.cookies.get('user')?.value
    ? JSON.parse(req.cookies.get('user').value)
    : null;
  
    if (path.startsWith('/upload') || path.startsWith('/requests') || path.startsWith('/notes')) {
        if (!user) {
          return NextResponse.redirect(new URL('/', req.url));
        }
      }

  if (path.startsWith('/admin')) {
    console.log(user)
    if (!user || user.role==="user") {
    
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  // For non-admin routes or if the user is an admin, allow access
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  // Match all request paths except for static files, api routes, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};