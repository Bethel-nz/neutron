import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
export const { auth: middleware } = NextAuth(authConfig);


export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - public assets
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|favicon-\\d+x\\d+\\.png|apple-touch-icon\\.png|android-chrome-\\d+x\\d+\\.png|manifest\\.webmanifest|sw\\.js).*)'
	]
};