'use client'

import { SessionProvider as SessionWrapper } from 'next-auth/react';

type SessionProviderProps = React.ComponentProps<typeof SessionWrapper>
import { enableReactUse } from '@legendapp/state/config/enableReactUse'

// Enable React hooks integration
enableReactUse()

export function SessionProvider({
  children, ...props
}: SessionProviderProps) {
  return <SessionWrapper {...props}>{children}</SessionWrapper>;
}