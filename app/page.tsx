import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { getGroups } from '@/actions/groups';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { BookmarksContent } from '@/components/bookmarks/content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Neutron - Your Bookmarks',
  description: 'Manage and organize your bookmarks with Neutron',
  openGraph: {
    title: 'Neutron - Your Bookmarks',
    description: 'Manage and organize your bookmarks with Neutron',
    type: 'website',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth');
  const groups = await getGroups(session?.user?.id);

  return (
    <div className='min-h-screen flex flex-col'>
      <Header initialGroups={groups} />
      <Suspense
        fallback={
          <main className='flex-1 container py-6'>
            <div className='flex items-center justify-between mb-8'>
              <div className='space-y-2'>
                <Skeleton className='h-8 w-[200px]' />
                <Skeleton className='h-4 w-[300px]' />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className='h-48 rounded-lg' />
              ))}
            </div>
          </main>
        }
      >
        <BookmarksContent />
      </Suspense>
    </div>
  );
}
