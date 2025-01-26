import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
// import config from '@/auth.config';
import { NextResponse } from 'next/server';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import drizzle from '@/drizzle';

import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { accounts, sessions, users, verificationTokens } from './drizzle/models';

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({

	adapter: DrizzleAdapter(drizzle, {
		usersTable: users,
		sessionsTable: sessions,
		accountsTable: accounts,
		verificationTokensTable: verificationTokens,
	}),

	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await drizzle.query.users.findFirst({
					where: (users, { eq }) => eq(users.email, credentials.email as string)
				});

				if (!user || !user.password) {
					return null;
				}

				try {
					const validPassword = await bcrypt.compare(credentials.password as string, user.password);

					if (!validPassword) {
						return null;
					}

					return {
						id: user.id,
						email: user.email,
						name: user.name,
					};
				} catch (error) {
					console.error('Error verifying password:', error);
					return null;
				}
			}
		}),
	],

	pages: {
		signIn: '/auth',
		error: '/auth/error',
	},

	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.email = user.email
				token.name = user.name
			}
			return { ...token }
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					id: token.id as string,
					email: token.email as string,
					name: token.name
				}
			}
		},
		async redirect() {
			return '/';
		},
		// WTH would i have to go through excess stress just to validate requests
		authorized: async ({ request, auth }) => {
			const { pathname } = request.nextUrl;

			const publicRoutes = ['/auth', '/manifest.webmanifest', "/sw.js"];
			const assetPatterns = [
				/\.(png|jpg|jpeg|gif|svg|ico)$/,  // Image files
				/\/icons\//,                      // Icon directory
				/\/images\//,                     // Images directory
				/\/assets\//,                     // General assets
				/\/favicon/,                      // Favicon variations
				/\/apple-touch-icon/,             // Apple touch icons
				/\/android-chrome/,               // Android chrome icons
				/\/site\.webmanifest$/,          // Site manifest
				/\/robots\.txt$/,                 // Robots.txt
			];

			const isLoggedIn = !!auth?.user;
			const isAssetRequest = assetPatterns.some(pattern => pattern.test(pathname));

			if (publicRoutes.includes(pathname) || isAssetRequest) {
				return true;
			}
			// Handle API routes
			if (pathname.startsWith('/api')) {
				if (request.method === "POST") {
					try {
						const { authToken } = (await request.json()) ?? {};
						return auth?.user?.id === authToken;
					} catch {
						return NextResponse.json({ error: "Invalid request" }, { status: 401 });
					}
				}
			}

			// For all other routes, require authentication
			return isLoggedIn;
		}
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60,
		updateAge: 24 * 60 * 60,
	},

	// ...config,
} satisfies NextAuthConfig);