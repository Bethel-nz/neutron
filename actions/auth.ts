'use server';

import { loginSchema, registerSchema } from '@/lib/schemas/auth';
import { signIn, signOut } from '@/auth';
import drizzle from '@/drizzle';
import { groups, users } from '@/drizzle/models';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { eq } from 'drizzle-orm';
import { useSplashStore } from '@/store/use-splash-store';

/**
 * @note
 * Implementing seperate auth actions for login and register feels like an overkill, since the need for authentication is just so users have unique ids for the sync process.
 * I'm not sure if this is the best way to do it, but it works for now.
 * Not an overill apparently, yeh it keeps things clean and organized but it doesnt sit with me right now.
 * Todo: Implement a register action if the need arises.
 */

// HACK: tiny work around to reduce overhead when creating new api endpoint for auth
type AuthType = 'login' | 'register';
export async function auth(formData: FormData, type: AuthType) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const ValidatedRegister = registerSchema.safeParse({
    name: rawData.name || 'john doe',
    email: rawData.email,
    password: rawData.password,
  });
  const ValidatedLogin = loginSchema.safeParse({
    email: rawData.email,
    password: rawData.password,
  });

  if (!ValidatedLogin.success || !ValidatedRegister.success) {
    return {
      error:
        ValidatedRegister.error?.issues[0].message ||
        ValidatedLogin.error?.issues[0].message,
    };
  }

  try {
    const existingUser = await drizzle.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, ValidatedRegister.data.email),
      with: {
        groups: true,
      },
    });

    if (!existingUser) {
      if (type === 'login') {
        return { error: 'Invalid credentials' };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        ValidatedRegister.data.password,
        salt
      );

      const [newUser] = await drizzle
        .insert(users)
        .values({
          email: ValidatedRegister.data.email,
          name: ValidatedRegister.data.name,
          password: hashedPassword,
          emailVerified: new Date(),
          image: '',
        })
        .returning();
    } else {
      if (type === 'register') {
        return { error: 'User already exists' };
      }
      // Verify password for login
      const validPassword = await bcrypt.compare(
        ValidatedLogin.data.password,
        existingUser.password as string
      );
      if (!validPassword) {
        return { error: 'Invalid credentials' };
      }
    }

    await signIn('credentials', {
      email: ValidatedRegister.data.email,
      password: ValidatedRegister.data.password,
      redirect: true,
      callbackUrl: '/',
      redirectTo: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Auth error:', error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut({
    redirectTo: '/auth',
    redirect: true,
  });
}
