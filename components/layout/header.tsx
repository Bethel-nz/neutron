'use client';

import React from 'react';
// import { Group } from '@/types'
import { NeutronIcon } from '../ui/icon';
import { User } from 'next-auth';
import { GroupBadge, UserDropdown } from './header.client';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { getGroups } from '@/actions/groups';
import { Skeleton } from '@/components/ui/skeleton';
// import { useRouter } from 'next/navigation'
import { useActiveGroup } from '@/hooks/use-active-group';
// import { toast } from 'sonner'
import { CreateGroupDialog } from '@/components/groups/create-dialog';
import { Group } from '@/types';

interface HeaderProps {
  initialGroups?: Group[];
}

export function Header({ initialGroups = [] }: HeaderProps) {
  const { data: session, status: sessionStatus } = useSession();
  const user = session?.user;

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups', user?.id],
    queryFn: () => getGroups(user?.id as string),
    enabled: !!user?.id,
    initialData: initialGroups,
  });

  const { activeGroup, setActiveGroup } = useActiveGroup();

  // Set initial active group
  React.useEffect(() => {
    if (groups?.length >0 && !activeGroup ) {
      const defaultGroup = groups[0];
      setActiveGroup(defaultGroup);
    }
  }, [groups]);

  if (sessionStatus === 'loading' || !user) return null;

  return (
    <>
      <header className='sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-14 items-center'>
          <div className='mr-4 flex items-center space-x-2'>
            <NeutronIcon className='h-6 w-6' />
            <span className='hidden font-bold sm:inline-block'>Neutron</span>
            <span>/</span>
            <span className='text-muted-foreground'>
              {isLoading || !activeGroup ? (
                <Skeleton className='h-6 w-20 rounded-full' />
              ) : (
                <GroupBadge
                  currentGroup={activeGroup}
                  allGroups={groups || []}
                  onSelect={setActiveGroup}
                />
              )}
            </span>
            {/* 
						<button 
							className="text-muted-foreground hover:text-foreground transition-colors"
							onClick={open}
						>
							<Plus className="text-muted-foreground hover:text-foreground transition-colors size-4 md:size-6"/>
						</button> */}
          </div>

          <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
            <div className='w-full flex-1 md:w-auto md:flex-none'>
              <nav className='flex items-center'></nav>
            </div>

            <div className='flex items-center space-x-4'>
              <UserDropdown user={user as User} />
            </div>
          </div>
        </div>
      </header>
      <CreateGroupDialog />
    </>
  );
}
