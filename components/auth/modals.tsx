'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

// Lazy load the modal components
const Modal = dynamic(
  () => import('@/components/ui/modal').then((mod) => mod.Modal),
  {
    ssr: false,
  }
);
const ModalContent = dynamic(() =>
  import('@/components/ui/modal').then((mod) => mod.ModalContent)
);
const ModalHeader = dynamic(() =>
  import('@/components/ui/modal').then((mod) => mod.ModalHeader)
);
const ModalTitle = dynamic(() =>
  import('@/components/ui/modal').then((mod) => mod.ModalTitle)
);
const ModalTrigger = dynamic(() =>
  import('@/components/ui/modal').then((mod) => mod.ModalTrigger)
);

export function TermsModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          variant='link'
          className='px-0 underline underline-offset-4 hover:text-primary'
        >
          Terms of Service
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Terms of Service</ModalTitle>
        </ModalHeader>
        <div className='space-y-4'>
          <p>By using Neutron, you agree to:</p>
          <ul className='list-disc pl-4 space-y-2'>
            <li>Not do anything illegal (obviously)</li>
            <li>Be responsible for your own bookmarks</li>
            <li>
              Accept that this is a fun project, not a legally binding contract
              😅
            </li>
            <li>Have a good time organizing your bookmarks!</li>
          </ul>
          <p className='text-sm text-muted-foreground mt-4'>
            P.S. You really thought I'd write a serious terms of service? 😂
          </p>
        </div>
      </ModalContent>
    </Modal>
  );
}

export function PrivacyModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          variant='link'
          className='px-0 underline underline-offset-4 hover:text-primary'
        >
          Privacy Policy
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Privacy Policy</ModalTitle>
        </ModalHeader>
        <div className='space-y-4'>
          <p>Here's what you need to know:</p>
          <ul className='list-disc pl-4 space-y-2'>
            <li>Auth is just for syncing - we use your email as a unique ID</li>
            <li>Your bookmarks are yours - we don't sell or share your data</li>
            <li>Everything's encrypted and stored securely</li>
            <li>You can delete your account anytime</li>
          </ul>
          <p className='text-sm text-muted-foreground mt-4'>
            TL;DR: It's as private as you want it to be. We're here to help you
            organize, not collect your data! 🔒
          </p>
        </div>
      </ModalContent>
    </Modal>
  );
}
