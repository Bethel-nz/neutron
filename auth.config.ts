import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import drizzle from '@/drizzle';
import bcrypt from 'bcryptjs';
// import { NextResponse } from 'next/server';
// import Bun from 'bun'

// const password = "super-secure-pa$$word";

// const argonHash = await Bun.password.hash(password, {
// 	algorithm: 'argon2id',
// 	memoryCost: 4
// });

export const runtime = 'nodejs'

export default {

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

} satisfies NextAuthConfig;