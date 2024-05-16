import { NextResponse } from 'next/server';
import { auth } from 'morning-react-ui/app/auth';

export default auth((req) => {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    return NextResponse.next();
  }

  if (!req.auth && req.nextUrl.pathname !== '/login') {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
