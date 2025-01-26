import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SessionProvider } from '@/providers';
import { Toaster } from 'sonner';

import { Inter, Sora, DM_Sans } from 'next/font/google';
import { auth } from '@/auth';
import { QueryClientProvider } from '@/query.client';
import { RegisterSW } from '@/components/pwa/register';
import { InstallPrompt } from '@/components/pwa/install-prompt';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Neutron',
  description: 'Neutron - A simple and fast way to bookmark your articles.',
  abstract: 'Neutron - A simple and fast way to bookmark your articles.',
  applicationName: 'Neutron',
  category: 'productivity',
  creator: 'Bethel Nzekea',
  keywords: ['bookmark', 'article', 'productivity'],
  openGraph: {
    title: 'Neutron',
    description: 'Neutron - A simple and fast way to bookmark your articles.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  manifest: '/manifest.webmanifest',
  robots: 'index, follow',
  twitter: {
    card: 'summary_large_image',
    title: 'Neutron',
    description: 'Neutron - A simple and fast way to bookmark your articles.',
  },
  publisher: 'Neutron',
  alternates: {
    canonical: '/',
  },
  authors: [
    { name: 'Neutron', url: '' },
    { name: 'Bethel Nzekea', url: 'https://not-bethel.vercel.app' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Neutron',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#10B981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html
      lang='en'
      className={`${sora.variable} ${inter.variable} ${dmSans.variable}`}
    >
      <head>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/manifest.webmanifest' />
      </head>
      <body>
        <QueryClientProvider>
          <SessionProvider
            session={session}
            refetchOnWindowFocus={true}
            refetchWhenOffline={false}
            basePath='/api/auth'
            refetchInterval={60 * 60 * 5}
          >
            <main>{children}</main>
            <Toaster />
            <RegisterSW />
            <InstallPrompt />
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
