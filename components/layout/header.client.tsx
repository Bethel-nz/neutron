'use client';

import React, { useState, useRef } from 'react';
import { SignOutButton } from '@/components/ui/sign-out';
import { stringToGradient } from '@/lib/utils/color';
import { User } from 'next-auth';
import { Group } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronsUpDown, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { GroupActionsDialog } from '@/components/groups/actions-dialog';
import { useGroupDialog } from '@/store/use-group-dialog';

interface GroupBadgeProps {
  currentGroup: Group | null;
  allGroups: Group[];
  onSelect: (group: Group) => void;
}

export function GroupBadge({
  currentGroup,
  allGroups,
  onSelect,
}: GroupBadgeProps) {
  const [showActions, setShowActions] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimeoutRef = useRef<number | null>(null);

  const { open } = useGroupDialog();
  const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!currentGroup) return null;

  const gradient = stringToGradient(currentGroup.name);

  const handleGroupSelect = (group: Group) => {
    onSelect(group);
  };

  const handleHoldStart = () => {
    // Clear any existing timeout first
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }

    // Use proper typing for the timeout
    holdTimeoutRef.current = window.setTimeout(() => {
      setIsHolding(true);
      const actionTimeout = window.setTimeout(() => {
        setShowActions(true);
        setIsHolding(false);
      }, 200) as unknown as NodeJS.Timeout;

      actionTimeoutRef.current = actionTimeout;
    }, 500);
  };

  const handleHoldEnd = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    setIsHolding(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            className='flex items-center gap-2 px-3 py-1 rounded-full group  text-sm font-medium cursor-pointer relative'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onMouseLeave={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
          >
            <motion.div
              className='absolute inset-0 bg-gray-200 rounded-full origin-left'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHolding ? 1 : 0 }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
            <Avatar
              className='size-4 md:size-6 rounded-full ring-2 ring-gray-200 relative z-10'
              style={{ background: gradient }}
            />
            <p className='text-sm font-medium text-foreground  bg-gray-200 rounded-full px-2 py-1 relative z-10'>
              {currentGroup.name}
            </p>
            <ChevronsUpDown
              size={20}
              className='text-muted-foreground group-hover:text-foreground transition-colors bg-gray-200 rounded-full p-1 relative z-10'
            />
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-fit p-1' sideOffset={8}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {allGroups.map((group) => (
              <DropdownMenuItem
                key={group.id}
                className={cn(
                  'p-0 hover:bg-transparent space-y-2',
                  currentGroup?.id === group.id && 'bg-gray-200'
                )}
              >
                <button
                  className='flex w-full items-center gap-2 px-3 py-1 text-sm outline-none rounded-md hover:bg-gray-200 transition-colors'
                  onClick={() => handleGroupSelect(group)}
                >
                  <Avatar
                    className='size-4 rounded-full'
                    style={{ background: stringToGradient(group.name) }}
                  />
                  <span>{group.name}</span>
                </button>
              </DropdownMenuItem>
            ))}
          </motion.div>
          <hr className='mx-2 my-2' />
          <DropdownMenuItem className='p-0 hover:bg-transparent'>
            <button
              className='flex w-full items-center gap-2 px-3 py-2 text-xs outline-none hover:bg-gray-200 rounded-md transition-colors'
              onClick={() => {
                open();
              }}
            >
              <Plus className='text-muted-foreground hover:text-foreground transition-colors size-2 md:size-3' />
              <span>Add Group</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <GroupActionsDialog
        group={currentGroup}
        isOpen={showActions}
        onClose={() => setShowActions(false)}
      />
    </>
  );
}

export function UserDropdown({ user }: { user: User }) {
  const [open, setOpen] = React.useState(false);
  const gradient = stringToGradient(user.email! || 'user');
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
    : user.email?.[0].toUpperCase() || 'U';

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button
          className='relative h-6 md:h-8 w-fit gap-2 rounded-full group flex items-center justify-center ring-offset-background px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          whileTap={{ scale: 0.95 }}
        >
          <span className='flex w-full items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm outline-none '>
            <Avatar
              className='size-4 rounded-full'
              style={{ background: stringToGradient(user.name || initials) }}
            />
            <span className='font-semibold text-gray-700'>{user.name}</span>
          </span>
          <div
            className={cn(
              'p-1 rounded-full transition-all duration-200',
              'bg-gray-200'
            )}
          >
            <ChevronDown
              size={18}
              className={cn(
                'text-muted-foreground transition-transform duration-200',
                open && 'transform rotate-180'
              )}
            />
          </div>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-[80px] ring-2 ring-offset-1 ring-gray-200 p-1'
        sideOffset={8}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <DropdownMenuItem className='p-0 hover:bg-transparent'>
            <button
              className='flex w-full items-center gap-2 px-3 py-2 text-xs md:text-sm outline-none hover:bg-gray-200 rounded-md transition-colors'
              onClick={() =>
                toast.info("We're working on it!", {
                  description: 'Help is coming soon!',
                  duration: 10000,
                  icon: (
                    <HelpCircle size={15} className='text-muted-foreground' />
                  ),
                  action: {
                    label: 'Got it',
                    onClick: () => toast.dismiss(),
                  },
                })
              }
            >
              <HelpCircle size={16} className='text-muted-foreground' />
              <span>Help</span>
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem className='p-0 hover:bg-transparent'>
            <SignOutButton className='px-3 py-2' />
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
