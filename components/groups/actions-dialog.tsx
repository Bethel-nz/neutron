'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Group } from '@/types';
import { Settings, Trash, Share, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface GroupActionsDialogProps {
  group: Group;
  isOpen: boolean;
  onClose: () => void;
}

export function GroupActionsDialog({
  group,
  isOpen,
  onClose,
}: GroupActionsDialogProps) {
  const actions = [
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => toast.info('Coming soon!'),
    },
    {
      icon: Share,
      label: 'Share',
      onClick: () => toast.info('Coming soon!'),
    },
    {
      icon: Archive,
      label: 'Archive',
      onClick: () => toast.info('Coming soon!'),
    },
    {
      icon: Trash,
      label: 'Delete',
      onClick: () => toast.info('Coming soon!'),
      className: 'text-red-500 hover:text-red-600 hover:bg-red-50',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[320px]' hideClose>
        <DialogHeader>
          <DialogTitle>{group.name}</DialogTitle>
        </DialogHeader>
        <motion.div
          className='grid gap-2 py-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode='popLayout'>
            {actions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Button
                  variant='ghost'
                  className={`justify-start gap-2 text-muted-foreground hover:text-foreground ${
                    action.className || ''
                  }`}
                  onClick={() => {
                    action.onClick();
                    onClose();
                  }}
                >
                  <action.icon size={16} />
                  {action.label}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
