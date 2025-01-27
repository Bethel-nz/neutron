import { NextResponse } from 'next/server';
import { auth } from './auth';

export default auth((request: Request) => {
  const response = NextResponse.next();

  if (request.url.includes('/images/') || request.url.includes('.png')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|favicon-\\d+x\\d+\\.png|apple-touch-icon\\.png|android-chrome-\\d+x\\d+\\.png|manifest\\.webmanifest|sw\\.js).*)',
  ],
};
